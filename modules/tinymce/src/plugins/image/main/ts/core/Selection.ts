/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';

const setup = (editor: Editor) => {
  editor.on('click keyup touchend', () => {
    const selectedNode = editor.selection.getNode();
    RE.imageHandleClick(selectedNode);

    // if (selectedNode && editor.dom.hasClass(selectedNode, 'mce-preview-object')) {
    //   if (editor.dom.getAttrib(selectedNode, 'data-mce-selected')) {
    //     selectedNode.setAttribute('data-mce-selected', '2');
    //   }
    // }
  });

};

export default {
  setup
};
