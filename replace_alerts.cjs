const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.jsx')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes('alert(')) {
        let changed = false;
        const lines = c.split('\n');
        for(let i=0; i<lines.length; i++) {
          if (lines[i].includes('alert(')) {
            const l = lines[i].toLowerCase();
            if (l.includes('failed') || l.includes('error') || l.includes('not match') || l.includes('empty') || l.includes('first') || l.includes('required') || l.includes('select')) {
              lines[i] = lines[i].replace(/alert\(/g, 'toast.error(');
            } else {
              lines[i] = lines[i].replace(/alert\(/g, 'toast.success(');
            }
            changed = true;
          }
        }
        if (changed) {
          let modified = lines.join('\n');
          if (!modified.includes('import toast from')) {
            const reactImportIdx = lines.findIndex(l => l.startsWith('import React'));
            if (reactImportIdx !== -1) {
              lines.splice(reactImportIdx + 1, 0, 'import toast from "react-hot-toast";');
            } else {
              lines.unshift('import toast from "react-hot-toast";');
            }
            modified = lines.join('\n');
          }
          fs.writeFileSync(p, modified, 'utf8');
          console.log('Updated', p);
        }
      }
    }
  });
}

walk('src');
