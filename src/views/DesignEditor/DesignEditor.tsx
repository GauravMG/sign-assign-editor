import { useEffect } from "react";
import useEditorType from "~/hooks/useEditorType";
import SelectEditor from "./SelectEditor";
import GraphicEditor from "./GraphicEditor";
import PresentationEditor from "./PresentationEditor";
import VideoEditor from "./VideoEditor";
import useDesignEditorContext from "~/hooks/useDesignEditorContext";
import Preview from "./components/Preview";

const DesignEditor = () => {
  const editorType = useEditorType();
  const { displayPreview, setDisplayPreview, setEditorType } = useDesignEditorContext();

  useEffect(() => {
    if (editorType === "NONE") {
      setEditorType("GRAPHIC");
    }
  }, [editorType]);

  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
      {
        {
          NONE: null, 
          PRESENTATION: <PresentationEditor />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      }
    </>
  );
};

export default DesignEditor;
