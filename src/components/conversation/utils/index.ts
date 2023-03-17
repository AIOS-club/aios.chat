import PhotoSwipe from 'photoswipe';
import hljs from 'highlight.js';

const imgLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  const dataURL = img.src;
  const pswp = new PhotoSwipe({
    dataSource: [{ src: dataURL, w: img.naturalWidth, h: img.naturalHeight }],
    pswpModule: PhotoSwipe,
    index: 0,
  });
  pswp.on('uiRegister', () => {
    pswp.ui?.registerElement({
      name: 'download-button',
      order: 8,
      isButton: true,
      tagName: 'a',
      html: {
        isCustomSVG: true,
        inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
        outlineID: 'pswp__icn-download'
      },
      onInit: (element, _pswp) => {
        const el = element as HTMLAnchorElement;
        el.setAttribute('download', 'chat');
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');

        _pswp.on('change', () => {
          el.href = _pswp.currSlide?.data.src || '';
        });
      }
    });
  });
  pswp.init();
};

// 高亮代码块的函数
const highlightCode = (code: string, lang: string) => {
  const language = lang || 'plaintext';
  const highlighted = hljs.highlight(code, { language }).value;
  const header = `<div class="flex items-center justify-between px-4 py-1 bg-gray-800"><span>${language}</span><button class="flex items-center ml-auto gap-2 copy-button" data-copy-text="${encodeURIComponent(code)}"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button></div>`;
  return `${header}<div class="h-full p-4 pb-0 overflow-auto hidden-scroll-bar">${highlighted}</div>`;
};

export { highlightCode, imgLoad };
