/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';

declare let $: any;

const setup = (editor: Editor) => {
  editor.on('click keyup touchend', () => {
    const selectedNode = editor.selection.getNode();
    // 图片点击事件
    if (selectedNode && selectedNode.classList.contains('qf_image')) {
      $('#tinymce').blur();
      if (!selectedNode.classList.contains('borderline')) {
        selectedNode.classList.add('borderline');
        /// <reference path="./re.ts">
        RE.videoSelected(selectedNode.parentNode);
        RE.showOperate(selectedNode);
      }
    }

    // 图片操作命令行 变大变小
    if (selectedNode && selectedNode.classList.contains('tabsize')) {
      RE.tabSize(selectedNode);
    }

    // 图片操作命令行 添加注释
    if (selectedNode && selectedNode.classList.contains('addnote')) {
      RE.addNote(selectedNode);
    }
    // 图片备注点击
    if (selectedNode && selectedNode.classList.contains('qf_image_mark')) {
      /// <reference path="./re.ts">
      RE.clickImage(selectedNode);
    }

    if (selectedNode && editor.dom.hasClass(selectedNode, 'mce-preview-object')) {
      if (editor.dom.getAttrib(selectedNode, 'data-mce-selected')) {
        selectedNode.setAttribute('data-mce-selected', '2');
      }
    }
  });

};

export default {
  setup
};
