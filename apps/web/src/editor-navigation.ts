type EditorState = { dirty: boolean; saving: boolean };
const editors=new Set<()=>EditorState>();

export function registerEditorNavigation(read:()=>EditorState){
  editors.add(read);
  return ()=>{editors.delete(read);};
}

export function allowEditorNavigation():boolean{
  const states=[...editors].map(read=>read());
  if(states.some(state=>state.saving)){
    window.alert("A note save is still in progress. Wait for it to finish before leaving or replacing the note.");
    return false;
  }
  return !states.some(state=>state.dirty)||window.confirm("This note has unsaved changes. Leave and discard those changes? Cancel to keep editing or save them first.");
}
