var RE = {}
RE.editor = document.getElementById('mytextarea');

RE.currentSelection = {
  "startContainer": 0,
  "startOffset": 0,
  "endContainer": 0,
  "endOffset": 0
};
// Initializations
RE.callback = function () {
  // $('.tox-tinymce').css({height: height})
  // var e = {}
  // e.target = tinymce.activeEditor.selection.getNode()
  // RE.enabledEditingItems(e);
  window.location.href = "re-callback://" + encodeURI(RE.getEditHtml());
}

// resize
RE.resizeHeight = function () {
  let height = $('#mytextarea').find('#tinymce')[0].scrollHeight + 100
  $('.tox-tinymce').css({height: height})
}

// 标题回调
RE.titleCallBack = function () {
  var title = $('#qf_up_line').find('input').val()
  window.location.href = "re-title-callback://" + encodeURI(title);
}

// 点击主题分类的回调
RE.themeCallBack = function (theme_id) {
  window.location.href = 're-theme-callback://' + theme_id
}

// 设置标题栏版块
RE.setThreadBlocks = function (blocks) {
  let json = JSON.parse(blocks)
  let html = ''
  if (json.length <= 0) {
    return false
  }
  json.map(res => {
    console.log(res)
    if (res.isSelect) {
      html += `<li class="active" data-id="${res.typeid}">${res.typename}</li>`
    } else {
      html += `<li data-id="${res.typeid}">${res.typename}</li>`
    }
  })
  $('#qf_up_line ul').html(html)
}


RE.getEditHtml = function () {
  $('#mytextarea').find('.qf_image').removeClass('borderline')
  $('#mytextarea').find('.closeImg').remove()
  $('#mytextarea').find('.qf_img_operate').remove()
  $('#mytextarea').find('.closeImg').remove()
  console.log(tinyMCE.activeEditor.getContent())
  return tinyMCE.activeEditor.getContent();
}

RE.setHtml = function (html) {
  html = decodeURIComponent(html.replace(/\+/g, '%20'))
  // tinymce.get('mytextarea').getBody().innerHTML = html;
  // tinymce.DOM.setHTML('mytextarea', html);
  tinymce.activeEditor.setContent(html);
}

RE.setContent = function (html) {
  // var html = '<p><video class="qf_video" poster="https://qiance.qianfanyun.com/20200428_1354_1588064712337.jpg?imageslim|imageView2/1/w/420/h/747" controls="controls" width="375" height="281.9548872180451" data-qf-origin="20200428_1354_1588064712337.jpg" data-qf-poster-origin="20200428_1354_1588064712337.jpg?imageslim|imageView2/1/w/420/h/747" data-mce-fragment="1"><source src="https://qiance.qianfanyun.com/20200428_1354_1588064712337.jpg" type="video/mp4" /></video></p>\n' +
  // 	'<p>&nbsp;</p>'
  tinymce.activeEditor.setContent(html);
}

RE.deleteContent = function () {
  tinymce.activeEditor.execCommand('Delete')

  RE.enabledEditingItems()
}


RE.blur = function () {
  // 编辑器blur掉光标
  $('#mytextarea').blur()
}

RE.getText = function () {
  $('#mytextarea').find('.qf_image').removeClass('borderline')
  $('#mytextarea').find('.closeImg').remove()
  $('#mytextarea').find('.qf_img_operate').remove()
  $('#mytextarea').find('.closeImg').remove()
  // var activeEditor = tinymce.activeEditor;
  // var text = activeEditor.getContent({'format': 'text'});
  var html = tinyMCE.activeEditor.getContent()
  console.log(removeHTMLTag(html))
  return removeHTMLTag(html);
}

function removeHTMLTag(str) {
  var img_re = /<img[^>]+>/g;
  str = str.replace(img_re, '[图片]');
  var video_re = /<video[^>]+>/g;
  str = str.replace(video_re, '[视频]');
  str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
  str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
  //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
  str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
  str=str.replace(/\s/g,''); //将空格去掉
  return str;
}

RE.getWordCount = function () {
  var wordcount = tinymce.activeEditor.plugins.wordcount;
  return wordcount.body.getCharacterCountWithoutSpaces();
}

RE.setPlaceholder = function (content) {

}

RE.getAllImageList = function () {
  let qf_insert_video = $('#mytextarea').find('.qf_insert_video')
  let qf_image = $('#mytextarea').find('.qf_image')

  // TODO: 需要修改
  var obj = []
  if (qf_image.length > 0) {
    qf_image.each((index, item) => {
      let re = {}
      re.type = 0
      re.url = item.children[0].getAttribute('src')
      re.origin_url = item.children[0].getAttribute('src')
      re.height = item.children[0].getAttribute('original-height')
      re.width = item.children[0].getAttribute('original-width')
      obj.push(re)
    })
  }
  if (qf_insert_video.length > 0) {
    qf_insert_video.each((index, item) => {
      console.log(item)
      let re = {}
      re.type = 2
      re.url = item.children[0].getAttribute('poster')
      re.origin_url = item.children[0].getAttribute('src')
      re.height = item.children[0].height
      re.width = item.children[0].width
      obj.push(re)
    })
  }
  return obj
}


// RE.setHtml = function (html) {
//   tinymce.activeEditor.setContent(html);
// }

// 插入图片
RE.insertImage = function (attach) {
  let content = RE.getEditHtml()
  var url = attach.host + attach.name
  var origin_url = attach.name
  var html = `<p>&nbsp;</p>
              <p class="qf_image big noneditable" contenteditable="false"><img src="${url}" data-qf-origin="${origin_url}" alt="" width="${attach.w}" height="${attach.h}" data-mce-src="${url}"><span class="qf_image_mark"  contenteditable="false"></span></p>
              <p>&nbsp;</p>`
  // tinymce.activeEditor.execCommand('mceInsertContent', false, html)
  tinymce.activeEditor.setContent(content+html);
  RE.callback()
  // tinymce.activeEditor.selection.setNode(tinymce.activeEditor.dom.create('img', {src: 'https://qiance.qianfanyun.com/20200428_1354_1588064712337.jpg', title: 'some title'}));
}

// 插入视频
RE.insertVideo = function (video) {
  let content = RE.getEditHtml()
  video = JSON.parse(video)
  var poster = video.host + video.poster
  var origin_poster = video.poster
  var url = video.host + video.name
  var origin_url = video.name
  var w = ($('body').width());
  console.log(w)
  var h = w / 1.33;//设置宽高比例为1.33
  var source = `<source src="${url}" type="video/mp4" />`
  source = encodeURIComponent(source)
  var html = `<p>&nbsp;</p><p><span data-mce-object="video" class="mceNonEditable qf_insert_video mce-preview-object mce-object-video" data-mce-p-data-mce-fragment="1" data-mce-p-controls="controls" data-mce-p-poster="${poster}" data-mce-html="${source}">
	<video class="qf_video" data-qf-origin="${origin_url}" data-qf-poster-origin="${origin_poster}" src="${url}" poster="${poster}" width="${w}" height="${h}" frameborder="0"></video>
	</span></p><p>&nbsp;</p>`
  // tinymce.activeEditor.execCommand('mceInsertContent', false, html)
  tinymce.activeEditor.setContent(content+html);
  RE.callback()
}

// 视频选中事件
RE.videoSelected = function (currentNode) {
  // 加关闭按钮
  if ($('.closeImg').length > 0) {
    return false
  }

  let delHtml = document.createElement("span");
  delHtml.classList.add("closeImg")
  // delHtml.setAttribute('onclick', RE.deleteImg);
  delHtml.setAttribute('contenteditable', false)
  currentNode.appendChild(delHtml);
  currentNode.style.position = 'relative'


  // // 关闭按钮加点击事件,删除视频
  delHtml.onclick = function (e) {
    e.stopPropagation()
    QFH5.listCoverImages(function (state, data) {
      if (data.attaches.length > 0) {

        let src = currentNode.children[0].getAttribute('src')

        let result = data.attaches.findIndex(res => res.origin_url === src)
        if (result >= 0) {
          QFH5.toast(3, '封面图不可删除', 1)
          return false
        }
      }
      currentNode.remove()
    })
  }

}


RE.imageHandleClick = function (selectedNode) {
  console.log('图片点击')
  let parentNode = selectedNode.parentNode
  // 图片点击事件
  if (selectedNode.parentNode && selectedNode.parentNode.classList.contains('qf_image')) {
    RE.blur();
    $('#mytextarea').find('.qf_image').removeClass('borderline');
    $('#mytextarea').find('.closeImg').remove();
    $('#mytextarea').find('.qf_img_operate').remove();

    if (!parentNode.classList.contains('borderline')) {
      parentNode.classList.add('borderline');
      /// <reference path="./re.ts">
      RE.showOperate(parentNode);
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
  // 图片删除
  if (selectedNode && selectedNode.classList.contains('closeImg')) {
    QFH5.listCoverImages(function (state, data) {
      if (data.attaches.length > 0) {

        let src = parentNode.children[0].getAttribute('src')

        let result = data.attaches.findIndex(res => res.origin_url === src)
        if (result >= 0) {
          QFH5.toast(3, '封面图不可删除', 1)
          return false
        }
      }
      parentNode.remove()
    })
  }
}


RE.videoHandleClick = function (selectedNode) {
  if (selectedNode.parentNode && selectedNode.parentNode.classList.contains('qf_insert_video')) {
    RE.blur();
    $('#mytextarea').find('.qf_insert_video').removeClass('borderline');
    $('#mytextarea').find('.closeImg').remove();
    if (!selectedNode.parentNode.classList.contains('borderline')) {
      selectedNode.parentNode.classList.add('borderline');
      RE.videoSelected(selectedNode.parentNode);
    }
  }
}

// 图片操作弹窗
RE.showOperate = function (currentNode) {
  if ($('.qf_img_operate').length > 0) {
    return false
  }
  let small = currentNode.classList.contains('small') ? ' con' : ''
  let big = currentNode.classList.contains('big') ? ' con' : ''
  var operateTtml = '<span data-action="small" contenteditable="false" class="tabsize' + big + '"></span>\n' +
    '    <span data-action="big" contenteditable="false" class="tabsize' + small + '"></span>\n' +
    '    <span class="addnote" contenteditable="false">注释</span>\n'

  var html = document.createElement("div");
  html.classList.add("qf_img_operate")
  html.setAttribute('contenteditable', false)
  html.innerHTML = operateTtml
  currentNode.appendChild(html);


  // 加关闭按钮
  setTimeout(() => {
    RE.videoSelected(currentNode)
  },100)
}

// 图片变大变小
RE.tabSize = function (selectedNode) {
  RE.blur();
  const img = selectedNode.parentNode.parentNode.children[0];
  const width = img.getAttribute('width');
  if (width < document.body.clientWidth) {
    return false;
  }
  let type = selectedNode.getAttribute('data-action') === 'small' ? 1 : 2;
  img.parentNode.classList.remove('small', 'big');
  img.parentNode.classList.add(type === 1 ? 'small' : 'big');
  if (type === 1) {
    selectedNode.parentNode.parentNode.classList.remove('qf_w100');
    selectedNode.parentNode.parentNode.classList.add('qf_w50')
    img.parentNode.style.margin = '0 auto';
    selectedNode.classList.remove('con');
    selectedNode.nextElementSibling.classList.add('con');
  } else {
    selectedNode.parentNode.parentNode.classList.remove('qf_w50');
    selectedNode.parentNode.parentNode.classList.add('qf_w100')
    selectedNode.classList.remove('con');
    selectedNode.previousElementSibling.classList.add('con');
  }
}


// 图片添加备注
RE.addNote = function (seletedNode) {
  let children_mark = seletedNode.parentNode.parentNode.children[1]
  if (!children_mark.classList.contains('qf_image_mark')) {
    let remark = document.createElement('span')
    remark.classList.add('qf_image_mark')
    remark.setAttribute('contenteditable', false)
    seletedNode.parentNode.parentNode.insertBefore(remark, seletedNode.parentNode.parentNode.children[1])
    RE.clickImage(remark)
  } else {
    RE.clickImage(children_mark)
  }
}
// 图片备注点击
RE.clickImage = function (e) {
  var innerHtml = e.innerText
  window.markNode = e
  // window.markNode.innerText = '124421'
  // $('#mytextarea').find('.qf_image').removeClass('borderline');
  // $('#mytextarea').find('.closeImg').remove();
  // $('#mytextarea').find('.qf_img_operate').remove();
  RE.restorerange();
  QFH5.showImageRemarkLayer(innerHtml, function (state, data) {
    if (state === 1)
      window.markNode.innerText = data.remark
    $('#mytextarea').find('.qf_image').removeClass('borderline');
    $('#mytextarea').find('.closeImg').remove();
    $('#mytextarea').find('.qf_img_operate').remove();
    RE.callback()
  })
}

RE.currentSelection = {
  "startContainer": 0,
  "startOffset": 0,
  "endContainer": 0,
  "endOffset": 0
};


RE.restorerange = function () {
  var selection = window.getSelection();
  selection.removeAllRanges();
}

RE.setPadding = function (left, top, right, bottom) {
  document.body.style.paddingLeft = left
  document.body.style.paddingTop = top
  document.body.style.paddingRight = right
  document.body.style.paddingBottom = bottom
}
// 加粗
RE.setBold = function () {
  // 为了解决取消加粗的时候，一起取消了斜体做了兼容
  if (tinymce.activeEditor.queryCommandState('bold') && tinymce.activeEditor.queryCommandState('italic')) {
    window.italic = true
  } else {
    window.italic = false
  }
  tinymce.activeEditor.execCommand('Bold')
  window.italic && RE.setItalic()
}

// 无序列表
RE.setBullets = function () {
  RE.resetQuota()
  tinymce.activeEditor.execCommand('insertUnorderedList', false, {
    'list-attributes': {class: 'myunlistclass'},
    'list-item-attributes': {class: 'myunlistitemclass'},
  });
  window.bm && tinymce.activeEditor.selection.moveToBookmark(window.bm);
}


RE.queryListCommandState = function (editor, listName) {
  return function () {
    const parentList = editor.dom.getParent(editor.selection.getStart(), 'UL,OL,DL');
    return parentList && parentList.nodeName === listName;
  };
};
// 有序列表
RE.setNumbers = function () {
  RE.resetQuota()
  tinymce.activeEditor.execCommand('insertOrderedList', false, {
    'list-attributes': {class: 'myorderlistclass'},
    'list-item-attributes': {class: 'myorderlistitemclass'},
  });
  window.bm && tinymce.activeEditor.selection.moveToBookmark(window.bm);
}

// 斜体
RE.setItalic = function () {
  tinymce.activeEditor.execCommand('italic', false, null);
}

// 引用
RE.setQuota = function () {
  window.bm = tinymce.activeEditor.selection.getBookmark();
  tinymce.activeEditor.execCommand('mceBlockQuote')
}
// 插入图片链接视频下取消引用
RE.resetQuota = function(){
  if(RE.hasQuoteStyle())RE.setQuota();window.bm = null;
}
// 左对齐
RE.setJustifyLeft = function () {
  tinymce.activeEditor.execCommand('JustifyLeft')
}
//居中对齐
RE.setJustifyCenter = function () {
  tinymce.activeEditor.execCommand('JustifyCenter')
}
//右对齐
RE.setJustifyRight = function () {
  tinymce.activeEditor.execCommand('JustifyRight')
}

// 设置字体
RE.setFontSize = function (fontSize) {
  tinymce.activeEditor.execCommand('FontSize', false, fontSize)
}

//插入分割线
RE.insertSplitLine = function () {
  tinymce.activeEditor.execCommand('InsertHorizontalRule')
}
// 删除线
RE.setStrikeThrough = function () {
  tinymce.activeEditor.execCommand('Strikethrough')
}

// 下划线
RE.setUnderline = function () {
  tinymce.activeEditor.execCommand('Underline')
}

// 撤销
RE.undo = function () {
  tinymce.activeEditor.execCommand('Undo')
  RE.callback()
}

// 恢复
RE.redo = function () {
  tinymce.activeEditor.execCommand('Redo')
  RE.callback()
}

// 插入h标签
RE.setHeading = function (heading) {
  let name = 'h' + heading
  tinymce.activeEditor.execCommand('FormatBlock', false, name)
}

// 获取选取内容
RE.getSelectedRangeText = function () {
  let selected_text = tinymce.activeEditor.selection.getContent({format: 'text'})
  if (selected_text.length > 0) {
    return selected_text;
  }
  return '';
}

// 插入链接
RE.insertLink = function (url, title) {
  var html=''
  if(url.indexOf('http') > -1){
    html = `<a class="qf_insert_link mceNonEditable" data-mce-href="${url}" href="${url}">${title}</a>&nbsp;`
  }else{
    html = `<a class="qf_insert_link qf_scheme_link mceNonEditable" href="javascript:void(0);" data-mce-href="${url}" data-href="${url}">${title}</a>&nbsp;`
  }
  // tinymce.activeEditor.execCommand('mceLink', false, title);
  tinymce.activeEditor.execCommand('mceInsertContent', false, html)
  RE.callback();
}



// @人
RE.insertAt = function (uid, name) {
  var html = '<a class="qf_at" href="javascript:void(0)" contenteditable="false" data-uid="' + uid + '">@' + name + '</a>&nbsp;'
  tinymce.activeEditor.execCommand('mceInsertContent', false, html);
  RE.callback()
}

// 插入话题
RE.insertTopic = function (topic_id, name) {
  var html = '<a class="qf_topic" href="javascript:void(0)" contenteditable="false" data-topic-id="' + topic_id + '">#' + name + '#</a>&nbsp;'
  tinymce.activeEditor.execCommand('mceInsertContent', false, html);
  RE.callback()
}

// 插入表情
RE.insertExpression = function (url, smile, smileid, width, height) {
  var html = '<img src="' + url + '" data-smile="' + smile + '" smilieid="' + smileid + '" width="' + width + '" height="' + height + '">';
  tinymce.activeEditor.execCommand('mceInsertContent', false, html);
  RE.callback()
}
// 编辑链接
RE.jumpEditLink = function (self) {
  if(!self.classList.contains('qf_insert_link')){
    return false
  }
  // window.bm = tinymce.activeEditor.selection.getBookmark();
  var text = self.innerText
  var href = self.getAttribute('href')
  window.linkNode = self
  RE.blur()
  QFH5.jumpEditLink(text, href, function (state, data) {
    if (state == 1) {
      window.linkNode.innerHTML = data.text
      window.linkNode.setAttribute('href', data.link)
    }
  })
}


RE.insertAllImages = function (attaches) {
  attaches = JSON.parse(attaches)
  if (attaches.length > 0) {
    attaches.map((item, index) => {
      RE.insertImage(item)
    })
  }
}

// 编辑图片备注
RE.jumpEditImageMark = function (self) {
  var text = self.innerText
  var href = self.getAttribute('href')
  window.linkNode = self
}

// 是否有引用的样式
RE.hasQuoteStyle = function () {
  var currentNode = tinymce.activeEditor.selection.getNode();
  if (tinymce.activeEditor.queryCommandValue('formatBlock')) {
    let parents_re = tinymce.activeEditor.dom.getParents(currentNode)
    if (parents_re.length > 0 && parents_re.find(res => {
      return res.nodeName === 'BLOCKQUOTE'
    })) {
      return true
    }
  }
  return false
}

RE.enabledEditingItems = function (e) {
  var currentNode = tinymce.activeEditor.selection.getNode();

  var items = [];
  if (tinymce.activeEditor.queryCommandValue('formatBlock')) {
    let parents_re = tinymce.activeEditor.dom.getParents(currentNode)
    if (parents_re.length > 0 && parents_re.find(res => {
      return res.nodeName === 'BLOCKQUOTE'
    })) {
      items.push('formatQuota');
    }
  }
  if (tinymce.activeEditor.queryCommandState('bold')) {
    items.push('bold');
  }
  if (tinymce.activeEditor.queryCommandState('italic')) {
    items.push('italic');
  }
  if (tinymce.activeEditor.queryCommandState('subscript')) {
    items.push('subscript');
  }
  if (tinymce.activeEditor.queryCommandState('superscript')) {
    items.push('superscript');
  }
  if (tinymce.activeEditor.queryCommandState('strikeThrough')) {
    items.push('strikeThrough');
  }
  if (tinymce.activeEditor.queryCommandState('underline')) {
    items.push('underline');
  }
  if (tinymce.activeEditor.queryCommandState('insertOrderedList')) {
    items.push('orderedList');
  }
  if (tinymce.activeEditor.queryCommandState('insertUnorderedList')) {
    items.push('unorderedList');
  }
  if (tinymce.activeEditor.queryCommandState('justifyCenter')) {
    items.push('justifyCenter');
  }
  if (tinymce.activeEditor.queryCommandState('justifyFull')) {
    items.push('justifyFull');
  }
  if (tinymce.activeEditor.queryCommandState('justifyLeft')) {
    items.push('justifyLeft');
  }
  if (tinymce.activeEditor.queryCommandState('justifyRight')) {
    items.push('justifyRight');
  }
  if (tinymce.activeEditor.queryCommandState('insertHorizontalRule')) {
    items.push('horizontalRule');
  }
  var formatBlock = tinymce.activeEditor.queryCommandValue('formatBlock');
  if (formatBlock.length > 0) {
    items.push(formatBlock);
  }

  console.log(items)
  window.location.href = "re-state://" + encodeURI(items.join(','));
}

// 删除的时候图片和视频之间的固定结构保留，无法删除
RE.whiteBlockHandle = function (currentNode) {
  console.log(currentNode)
  console.log('删除')
  // 删除的时候，如果是删到视频，就blur掉，然后选中视频
  if(currentNode.children[0] && currentNode.children[0].classList.contains('qf_insert_video')){
    // 加边框
    currentNode.children[0].classList.add('borderline')

    // 加关闭按钮
    RE.videoSelected(currentNode.children[0])

    // 编辑器blur掉光标
    RE.blur()

    // 如果删除到视频这个元素，发现后面没有元素，就直接append一个空p标签上去
    if (currentNode.nextElementSibling === null) {
      var pEle = document.createElement('p')
      pEle.style.height = '25px'
      currentNode.parentNode.appendChild(pEle)
    }

    // 两个视频之间不允许删除空白间距
    if (currentNode.nextElementSibling && currentNode.nextElementSibling.children[0] && currentNode.nextElementSibling.children[0].classList.contains('qf_insert_video')) {
      let pEle = document.createElement('p')
      pEle.innerHTML = '&nbsp'
      currentNode.parentNode.insertBefore(pEle, currentNode.nextElementSibling)
    }

    // 视频后面是图片，中间不允许删除空白间距
    if (currentNode.nextElementSibling && currentNode.nextElementSibling.classList.contains('qf_image')) {
      let pEle = document.createElement('p')
      pEle.innerHTML = '&nbsp'
      currentNode.parentNode.insertBefore(pEle, currentNode.nextElementSibling)
    }
  }

  // 删除的时候，如果是删到图片，就blur掉，然后选中图片
  if (currentNode && currentNode.classList.contains('qf_image')) {
    // 加边框
    currentNode.classList.add('borderline')

    // 添加操作弹窗
    RE.showOperate(currentNode)

    // 编辑器blur掉光标
    RE.blur()



    // 如果删除到视频这个元素，发现后面没有元素，就直接append一个空p标签上去
    if (currentNode.nextElementSibling === null) {
      let pEle = document.createElement('p')
      pEle.innerHTML = '&nbsp'
      pEle.style.height = '25px'
      // pEle.style.backgroundColor = 'red'
      currentNode.parentNode.appendChild(pEle)
    }


    // 两个图片中间不允许删除空白间距
    if (currentNode.nextElementSibling && currentNode.nextElementSibling.classList.contains('qf_image')) {
      let pEle = document.createElement('p')
      pEle.innerHTML = '&nbsp'
      currentNode.parentNode.insertBefore(pEle, currentNode.nextElementSibling)
    }


    // 图片后面是视频，那么中间不允许删除空白间距
    if (currentNode.nextElementSibling && currentNode.nextElementSibling.children[0] && currentNode.nextElementSibling.children[0].classList.contains('qf_insert_video')) {
      let pEle = document.createElement('p')
      pEle.innerHTML = '&nbsp'
      currentNode.parentNode.insertBefore(pEle, currentNode.nextElementSibling)
    }
  }
}
