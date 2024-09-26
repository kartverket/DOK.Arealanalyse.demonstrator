const jsonLineRegex = /^( *)("[a-zæøåA-ZÆØÅ0-9]+": )?("[^"]*"|[a-zæøåA-ZÆØÅ0-9.+-]*|\[\]|{})?([,[{])?$/mg;

export function getHtmlString(data) {
   const htmlStr = JSON.stringify(data, null, 2)
      .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(jsonLineRegex, replacer);

   return htmlStr;
}

function replacer(_, pIndent, pKey, pValue, pEnd) {
   const key = '<span class="json-key">';
   const value = '<span class="json-value">';
   const string = '<span class="json-string">';
   let replaced = pIndent || '';

   if (pKey) {
      replaced = replaced + key + '"' + pKey.replace(/[": ]/g, '') + '"</span>: ';
   }

   if (pValue) {
      replaced = replaced + (pValue[0] === '"' ? string : value) + pValue + '</span>';
   }

   return replaced + (pEnd || '');
}