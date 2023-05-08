import React, { useState, useEffect, useRef } from "react";
import TuiImageEditor from "tui-image-editor";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "./toast.css";

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
  const handleClick = (e) => {
    //console.log(document.querySelectorAll('.svg_ic-menu')[7]);
    if(e.target == document.querySelectorAll('.svg_ic-menu')[7]) console.log(e.target);
    //getActiveObject();
    //&& e.target.children[0].href.baseVal == "#ic-delete"
  }
  return (
    <div  >
      <ImageEditor {...props} onClick={(e) => handleClick(e)} onError={() => console.log('error')} />
    </div>
  );
}
