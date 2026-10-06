import { describe, expect, it } from "vitest";
import { extractDocumentText } from "./document-text.js";
import JSZip from "jszip";

function samplePdf(text: string): Uint8Array {
  const stream = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function sampleDocx(text: string): Uint8Array {
  const files = [
    ["[Content_Types].xml", '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ["_rels/.rels", '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml", `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`]
  ] as const;
  const locals: Buffer[] = [], centrals: Buffer[] = [];
  let offset = 0;
  for (const [name, body] of files) {
    const filename = Buffer.from(name), data = Buffer.from(body);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4);
    local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(filename.length, 26);
    locals.push(local, filename, data);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt32LE(data.length, 20); central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(filename.length, 28); central.writeUInt32LE(offset, 42);
    centrals.push(central, filename);
    offset += local.length + filename.length + data.length;
  }
  const centralSize = centrals.reduce((total, chunk) => total + chunk.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10); end.writeUInt32LE(centralSize, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

describe("document text extraction", () => {
  it("extracts slide text and speaker notes from a PowerPoint", async () => {
    const zip = new JSZip();
    zip.file("ppt/slides/slide2.xml", '<p:sld xmlns:p="x" xmlns:a="y"><a:p><a:r><a:t>Second slide</a:t></a:r></a:p></p:sld>');
    zip.file("ppt/slides/slide1.xml", '<p:sld xmlns:p="x" xmlns:a="y"><a:p><a:r><a:t>Percent &amp; statistics</a:t></a:r></a:p><a:p><a:r><a:t>Practice 4.1</a:t></a:r></a:p></p:sld>');
    zip.file("ppt/notesSlides/notesSlide1.xml", '<p:notes xmlns:p="x" xmlns:a="y"><a:p><a:r><a:t>Remember the growth factor</a:t></a:r></a:p></p:notes>');
    const result = await extractDocumentText(await zip.generateAsync({ type: "uint8array" }), "maths.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    expect(result).toEqual({ text: "Slide 1\nPercent & statistics\nPractice 4.1\n\nSlide 2\nSecond slide\n\nSpeaker notes 1\nRemember the growth factor", complete: true, reason: null });
  }, 20_000);

  it("keeps a picture-only PowerPoint explicitly incomplete", async () => {
    const zip = new JSZip();
    zip.file("ppt/slides/slide1.xml", '<p:sld xmlns:p="x" xmlns:a="y"><p:pic/></p:sld>');
    expect(await extractDocumentText(await zip.generateAsync({ type: "uint8array" }), "images.pptx", "application/octet-stream"))
      .toEqual({ text: null, complete: false, reason: "no_embedded_text" });
  }, 20_000);

  it("extracts slide text from a presentation larger than the old rich-document limit", async () => {
    const zip = new JSZip();
    zip.file("ppt/slides/slide1.xml", '<p:sld xmlns:p="x" xmlns:a="y"><a:p><a:r><a:t>Large lesson deck</a:t></a:r></a:p></p:sld>');
    zip.file("ppt/media/image1.bin", new Uint8Array(11_000_000), { compression: "STORE" });
    const bytes = await zip.generateAsync({ type: "uint8array", compression: "STORE" });
    expect(bytes.byteLength).toBeGreaterThan(10_000_000);
    expect(await extractDocumentText(bytes, "large.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"))
      .toEqual({ text: "Slide 1\nLarge lesson deck", complete: true, reason: null });
  }, 60_000);

  it("extracts embedded PDF text in a bounded worker", async () => {
    const result = await extractDocumentText(samplePdf("Algebra revision"), "lesson.pdf", "application/pdf");
    expect(result).toEqual({ text: "Algebra revision", complete: true, reason: null });
  }, 20_000);

  it("extracts a Word document in a bounded worker", async () => {
    const result = await extractDocumentText(sampleDocx("Quadratic functions"), "revision.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    expect(result).toEqual({ text: "Quadratic functions", complete: true, reason: null });
  }, 20_000);

  it("extracts named Excel sheets, cell locations, saved formulas and shared strings", async () => {
    const zip = new JSZip();
    zip.file("xl/workbook.xml", '<workbook><sheets><sheet name="Prøveplan" sheetId="1" r:id="rId2"/></sheets></workbook>');
    zip.file("xl/_rels/workbook.xml.rels", '<Relationships><Relationship Id="rId2" Target="worksheets/sheet3.xml"/></Relationships>');
    zip.file("xl/sharedStrings.xml", '<sst><si><t>Matematikk &amp; statistikk</t></si></sst>');
    zip.file("xl/worksheets/sheet3.xml", '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="inlineStr"><is><t>24.09.2026</t></is></c></row><row r="2"><c r="A2"><f>SUM(B2:B3)</f><v>42</v></c><c r="C2" t="b"><v>1</v></c></row></sheetData></worksheet>');
    expect(await extractDocumentText(await zip.generateAsync({ type: "uint8array" }), "plan.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
      .toEqual({ text: "Sheet 1: Prøveplan\nA1: Matematikk & statistikk\nB1: 24.09.2026\nA2: 42 (saved formula result; =SUM(B2:B3))\nC2: TRUE", complete: true, reason: null });
  }, 20_000);

  it("marks Excel formulas without saved results incomplete", async () => {
    const zip = new JSZip();
    zip.file("xl/workbook.xml", '<workbook><sheets><sheet name="Tasks" r:id="rId1"/></sheets></workbook>');
    zip.file("xl/_rels/workbook.xml.rels", '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>');
    zip.file("xl/worksheets/sheet1.xml", '<worksheet><sheetData><row r="1"><c r="A1"><f>SUM(B1:B4)</f></c></row></sheetData></worksheet>');
    expect(await extractDocumentText(await zip.generateAsync({ type: "uint8array" }), "tasks.xlsx", "application/octet-stream"))
      .toEqual({ text: "Sheet 1: Tasks\nA1: Formula =SUM(B1:B4) (saved result unavailable)", complete: false, reason: "workbook_feature_or_text_limit" });
  }, 20_000);

  it("does not claim text extraction from an empty Excel sheet", async () => {
    const zip = new JSZip();
    zip.file("xl/workbook.xml", '<workbook><sheets><sheet name="Empty" r:id="rId1"/></sheets></workbook>');
    zip.file("xl/_rels/workbook.xml.rels", '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>');
    zip.file("xl/worksheets/sheet1.xml", "<worksheet><sheetData/></worksheet>");
    expect(await extractDocumentText(await zip.generateAsync({ type: "uint8array" }), "empty.xlsx", "application/octet-stream"))
      .toEqual({ text: null, complete: false, reason: "no_embedded_text" });
  }, 20_000);

  it("keeps unsupported and invalid originals explicitly incomplete", async () => {
    expect(await extractDocumentText(new TextEncoder().encode("hello"), "photo.png", "image/png"))
      .toEqual({ text: null, complete: false, reason: "unsupported_format" });
    expect(await extractDocumentText(new TextEncoder().encode("not a PDF"), "bad.pdf", "application/pdf"))
      .toEqual({ text: null, complete: false, reason: "invalid_document" });
  });

  it("reads UTF-8 text without a worker", async () => {
    expect(await extractDocumentText(new TextEncoder().encode("Homework due Friday"), "notes.txt", "text/plain"))
      .toEqual({ text: "Homework due Friday", complete: true, reason: null });
  });
});
