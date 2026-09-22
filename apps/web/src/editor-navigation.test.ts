import { describe,expect,it,vi } from "vitest";
import { allowEditorNavigation,registerEditorNavigation } from "./editor-navigation";

describe("editor navigation protection",()=>{
  it("does not offer discard for shared edits that are not durably saved",()=>{
    const confirm=vi.fn().mockReturnValue(true),alert=vi.fn();
    vi.stubGlobal("window",{confirm,alert});
    const unregister=registerEditorNavigation(()=>({dirty:true,saving:false,canDiscard:false}));
    try{
      expect(allowEditorNavigation()).toBe(false);
      expect(confirm).not.toHaveBeenCalled();
      expect(alert).toHaveBeenCalledOnce();
    }finally{unregister();vi.unstubAllGlobals();}
  });
  it("reads the latest state and requires an explicit discard decision",()=>{
    const confirm=vi.fn().mockReturnValue(false),alert=vi.fn();
    vi.stubGlobal("window",{confirm,alert});
    const state={dirty:false,saving:false};
    const unregister=registerEditorNavigation(()=>state);
    try{
      expect(allowEditorNavigation()).toBe(true);
      state.dirty=true;
      expect(allowEditorNavigation()).toBe(false);
      confirm.mockReturnValue(true);
      expect(allowEditorNavigation()).toBe(true);
      state.saving=true;
      expect(allowEditorNavigation()).toBe(false);
      expect(alert).toHaveBeenCalledOnce();
      expect(confirm).toHaveBeenCalledTimes(2);
    }finally{unregister();vi.unstubAllGlobals();}
    expect(allowEditorNavigation()).toBe(true);
  });
});
