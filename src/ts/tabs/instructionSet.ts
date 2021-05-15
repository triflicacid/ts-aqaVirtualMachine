import globals from "../globals";
import { AssemblerType } from "../types/Assembler";
import { IInstructionSetProperties, ITabInfo } from "../types/Tabs";
import { hex } from "../utils/general";

export const info: ITabInfo = {
  content: undefined,
  text: 'Instruction Set',
  displayMulti: false,
};

export const properties: IInstructionSetProperties = {};

function generateAssemblerInstructionSetHTML(): HTMLDivElement {
  const wrapper = document.createElement('div');

  const table = document.createElement('table');
  wrapper.appendChild(table);
  table.insertAdjacentHTML('beforeend', `<thead><tr><th>Parent Mnemonic</th><th>Mnemonic</th><th>Opcode</th><th title='Is instruction present in the A-level AQA assembly language spec?'>AQA?</th><th>Arguments</th><th>Description</th></tr></thead>`);
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const M = globals.assemblerInstructionMap;
  let lastParentInstruction: string;
  for (const parentInstruction in M) {
    if (M.hasOwnProperty(parentInstruction)) {
      for (const subInstruction in M[parentInstruction]) {
        if (M[parentInstruction].hasOwnProperty(subInstruction)) {
          const tr = document.createElement("tr"), info = M[parentInstruction][subInstruction];
          tr.insertAdjacentHTML('beforeend', `<td><b>${lastParentInstruction == parentInstruction ? '' : parentInstruction}</b></td>`);
          tr.insertAdjacentHTML('beforeend', `<td>${subInstruction}</td>`);
          const opcode = globals.cpuInstructionSet[subInstruction];
          if (opcode === undefined) {
            tr.insertAdjacentHTML('beforeend', `<td title='Not present in the CPU instruction set'></td>`);
          } else {
            const word = globals.cpu.toHex(opcode);
            tr.insertAdjacentHTML('beforeend', `<td><code title='CPU word: 0x${word}'>0x${hex(opcode)}</code></td>`);
          }
          tr.insertAdjacentHTML('beforeend', `<td><span style='color:${info.isAQA ? 'green' : 'red'}'>${info.isAQA ? "Yes" : "No"}</span></td>`);

          const args = info.args.length === 0 ? '' : '<code>' + info.args.map(a => `&lt;${AssemblerType[a].toLowerCase()}&gt;`).join(' ') + '</code>';
          tr.insertAdjacentHTML('beforeend', `<td title='${info.args.length} arguments'>${args}</td>`);
          tr.insertAdjacentHTML('beforeend', `<td><small>${info.desc}</small></td>`);
          tbody.appendChild(tr);

          lastParentInstruction = parentInstruction;
        }
      }
    }
  }

  return wrapper;
}

export function init() {
  const content = document.createElement("div");
  info.content = content;

  const title = document.createElement("h2");
  content.appendChild(title);
  title.innerText = "AQA Processor Instruction Set";

  content.appendChild(generateAssemblerInstructionSetHTML());
}