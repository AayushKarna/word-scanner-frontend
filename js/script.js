const overlay = document.getElementById('loader-overlay');
const preLoader = document.getElementById('preloader');
const loader = document.getElementById('loader');
const allLinks = document.querySelectorAll('a:link');
const scanBtn = document.getElementById('scan-btn');
const siteInfoEl = document.getElementById('site-info');
const siteInfoElHidden = document.getElementById('site-info-hidden');
const siteInput = document.getElementById('site-input');
const keywordInput = document.getElementById('keyword-input');
const csvBtn = document.getElementById('csv-btn');

const showLoader = function () {
  loader.classList.remove('hidden-el');
  preLoader.classList.remove('hidden-el');
  overlay.classList.remove('hidden-el');
};

const hideLoader = function () {
  loader.classList.add('hidden-el');
  preLoader.classList.add('hidden-el');
  overlay.classList.add('hidden-el');
};

const smoothScroll = function (href) {
  // scroll back to top
  if (href === '#') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  if (href !== '#' && href !== '#!' && href.startsWith('#')) {
    const sectionEl = document.querySelector(href);
    sectionEl.scrollIntoView({
      behavior: 'smooth'
    });
  }
};

const downloadTableAsCsv = function (tableId, seperator = ',') {
  const rows = document.querySelectorAll('table#' + tableId + ' tr');
  const csv = [];

  rows.forEach((row, i) => {
    const cols = row.querySelectorAll('td, th');
    const rowData = [];

    cols.forEach((col, j) => {
      const data = col.innerText
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/(\s\s)/gm, ' ');
      rowData.push('"' + data + '"');
    });

    csv.push(rowData.join(seperator));
  });

  const csvString = csv.join('\n');

  //  Download
  const filename =
    'export_' + tableId + '_' + new Date().toLocaleDateString() + '.csv';
  const link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString)
  );
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fetchData = async function () {
  showLoader();

  const reqUrl = 'http://127.0.0.1:3000/api/v1/sites';

  // 1. check if no input
  if (!siteInput.value || !keywordInput.value) {
    Qual.error('Oops! No input.');
    hideLoader();
    return;
  }

  // 2. convert into array at empty space
  const siteArr = siteInput.value
    .trim()
    .split('\n')
    .map(el => {
      const trimmed = el.trim();
      return encodeURI(
        !/^https?:\/\//i.test(trimmed) ? `http://${trimmed}` : trimmed
      );
    });

  const keywordArr = keywordInput.value.split('\n');

  const requestConfig = {
    method: 'POST',
    url: reqUrl,
    data: {
      keywords: keywordArr,
      websiteList: siteArr
    }
  };

  try {
    const { data, status } = await axios(requestConfig);

    if (status === 200) {
      if (data.status === 'success') {
        siteInfoEl.innerHTML = '';
        siteInfoElHidden.innerHTML = '';

        data.data.data.forEach(el => {
          const siteDOM = `
            <tr class="tr-${el.isPresent}">
            <td>
              <a
                href="${el.site}"
                target="_blank"
                class="site-link"
                >${el.site
                  .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
                  .replace('/', '')}</a
              >
            </td>
            <td ${el.isPresent ? 'class="true-label"' : ''}>${
            (el.isPresent + '').charAt(0).toUpperCase() +
            (el.isPresent + '').slice(1)
          }</td>
  
            <td>
              <a
                href="${el.site}"
                class="icon-link"
                target="_blank"
                ><ion-icon name="open-outline" class="link-icon"></ion-icon
              ></a>
            </td>
          </tr>
          `;

          const siteDOMHidden = `
            <tr class="tr-${el.isPresent}">
            <td>
              <a
                href="${el.site}"
                target="_blank"
                class="site-link"
                >${el.site}</a
              >
            </td>
            <td ${el.isPresent ? 'class="true-label"' : ''}>${
            (el.isPresent + '').charAt(0).toUpperCase() +
            (el.isPresent + '').slice(1)
          }</td>
          </tr>
          `;
          siteInfoEl.insertAdjacentHTML('beforeend', siteDOM);
          siteInfoElHidden.insertAdjacentHTML('beforeend', siteDOMHidden);
        });

        hideLoader();
        smoothScroll('#result');
      }
    } else {
      console.log(data);
    }
  } catch (err) {
    Qual.error(err.response.data.message);
    hideLoader();
    return;
  }
};

scanBtn.addEventListener('click', fetchData);

csvBtn.addEventListener('click', e => {
  downloadTableAsCsv('main-table-hidden');
});

window.addEventListener('load', () => {
  hideLoader();
});
