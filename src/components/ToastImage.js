import React from "react";
import TuiImageEditor from "tui-image-editor";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "./ToastImage.css";

class ImageEditor extends React.Component {
  rootEl = React.createRef();
  imageEditorInst = null;

  componentDidMount() {
    this.imageEditorInst = new TuiImageEditor(this.rootEl.current, {
      ...this.props
    });
  }

  componentWillUnmount() {
    // this.unbindEventHandlers();
    this.imageEditorInst.destroy();
    this.imageEditorInst = null;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}

export default function ToastImage() {
  const props = {
    includeUI: {
      menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
      initMenu: "filter",
      uiSize: {
        width: "100%",
        height: "700px"
      },
      menuBarPosition: "bottom"
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70
    }
  };

  return (
    <div>
      <ImageEditor {...props} />
    </div>
  );
}
