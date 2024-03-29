const { typeConfig } = require('./transformer.config');
const { readFile, writeFile } = require('fs').promises;

const attrs = {};
let result = `:root {\n  `;

(async () => {
  const tokens = await readFile('./data/output.json');
  const tokenObject = JSON.parse(tokens.toString());

  addTokenLine(tokenObject, '-', 0);

  const attrKey = Object.keys(attrs);
  attrKey.forEach((v) => {
    result += `/* ${v} */\n  ${attrs[v]}`;
  });
  result += '}';
  writeFile('./data/output.css', result);
  //   exec('npm run lint-style', (err, stdout, stderr) => {
  //     console.log('stdout: ' + stdout);
  //     console.log('stderr: ' + stderr);
  //     if (err !== null) {
  //       console.log('exec error!: ' + err);
  //     }
  //   });
})();

//! 재귀함수 시작
function addTokenLine(obj, str, depth) {
  if (typeof obj === 'string') return;

  const objectKeys = Object.keys(obj);
  if (objectKeys.length === 0) return;

  for (let i = 0; i < objectKeys.length; i++) {
    const key = objectKeys[i];
    if (key === 'value') {
      if (!typeConfig[obj.type]) return;
      else {
        if (!attrs[obj.type]) {
          attrs[obj.type] = '';
        }
      }

      //? modding the name
      const modifiedName = str.toLowerCase().replaceAll(' ', '-'); //! 노드 버전 주의
      //? modding the value
      const modifiedValue = modValue(obj[key], obj.type);

      attrs[obj.type] += `${modifiedName}: ${modifiedValue};\r  `;

      return;
    }
    console.log(depth);
    if (depth >= 1) {
      addTokenLine(obj[key], `--${key}`, depth + 1);
    } else {
      addTokenLine(obj[key], `${str}-${key}`, depth + 1);
    }
  }
}

function modValue(value, type) {
  if (type === 'fontFamilies') return `'${value}'`;

  if (typeof value === 'object') {
    if (value.type === 'dropShadow') {
      return makeTextForStylesheet(value, value.type);
    }
    if (Array.isArray(value)) {
      let temp = '';
      value.forEach((v, i) => {
        temp += `${makeTextForStylesheet(v, v.type)}, `;
      });
      return temp.substring(0, temp.length - 2);
    }
  }
  return value;
}

function makeTextForStylesheet(value, type) {
  switch (type) {
    case 'dropShadow':
      return `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`;

    default:
      return 'SomethingWrong!';
  }
}
// (async () => {
//   let tokens = await readFile('./data/output.json');
//   const obj = JSON.parse(tokens.toString());
//   const arr = Object.entries(obj);

//   // console.log(arr);
//   const result = {};
//   const innerResult = {};
//   // option: 사용할 type을 설정해주는 객체
//   const configKeys = Object.keys(typeConfig);
//   configKeys.forEach((v) => {
//     if (typeConfig[v]) {
//       result[v] = '';
//     }
//   });

//   // 각 속성들을 CSS파일 형태로 변환해주는 코드
//   arr.forEach((v, i) => {
//     const type = v[1].type;
//     const value = v[1].value;
//     const name = v[0].toLowerCase().replaceAll(' ', '-'); //! replaceAll: node버전 최신화 요함

//     if (type === undefined) {
//       const innerArr = Object.entries(v[1]);

//       innerArr.forEach((v, i) => {
//         const innerType = v[1].type;
//         const innerValue = v[1].value;
//         const innerName = v[0].toLowerCase().replaceAll(' ', '-'); //! replaceAll: node버전 최신화 요함

//         if (result[innerType] !== undefined) {
//           // 속성이 지금보다 훨씬 많아질 경우 switch문 사용을 고려
//           if (innerType === 'boxShadow') {
//             let boxShadow = '';
//             innerValue.forEach((shadow) => {
//               boxShadow += `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color},`;
//             });
//             boxShadow = boxShadow.substring(0, boxShadow.length - 1) + ';';

//             innerResult[innerType] += `--${innerName}:${boxShadow}`;
//           } else {
//             innerResult[innerType] += `--${innerName}:${innerValue};`;
//           }
//         }
//       });
//     } else {
//       if (result[type] !== undefined) {
//         // 속성이 지금보다 훨씬 많아질 경우 switch문 사용을 고려
//         console.log('Test: ', value);
//         if (type === 'boxShadow') {
//           let boxShadow = '';
//           if (Array.isArray(value)) {
//             value.forEach((shadow) => {
//               boxShadow += `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color},`;
//             });
//           } else {
//             {
//               boxShadow += `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color},`;
//             }
//           }
//           boxShadow = boxShadow.substring(0, boxShadow.length - 1) + ';';

//           result[type] += `--${name}:${boxShadow}`;
//           // 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
//         } else result[type] += `--${name}:${value};`;
//       }
//     }
//   }); // => type을 기준으로 필터링 한 객체형태로 리턴

//   for (let ele in innerResult) {
//     innerResult[ele] = innerResult[ele].replace('undefined', '');
//   }

//   const combineResult = { ...result, ...innerResult };

//   const css = objectToCss(combineResult);

//   writeFile('./data/tranformed.json', JSON.stringify(combineResult));
//   writeFile('./data/output.css', css);
// })();

// function objectToCss(object) {
//   const keys = Object.keys(object);
//   let result = ':root {\n  ';
//   keys.forEach((v) => {
//     console.log(object[v]);
//     result += `/* ${v} */\n  ${object[v].replaceAll(';', ';\n  ')}`;
//   });
//   result += '}';
//   return result;
// }
