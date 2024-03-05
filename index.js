const { exec } = require('child_process');

function dateFormat(fmt, date = new Date()) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),
    "M+": (date.getMonth() + 1).toString(),
    "D+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "m+": date.getMinutes().toString(),
    "s+": date.getSeconds().toString()
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

function shell({ e, next = null }) {
  console.log('> ' + e);

  let command = exec(e, error => {
    if (error) console.log(error);
    return;
  });
  command.stdout.on('data', data => {
    console.log(data);
  });
  command.stderr.on('data', data => {
    console.log(data);
  });
  command.on('exit', code => {
    if (next) next();
    else console.log('End');
  });
  return command;
}

shell({
  e: 'git config --global user.email "h1606051253@gmail.com"',
  next: () => {
    shell({
      e: 'git config --global user.name "HCLonely"',
      next: () => {
        shell({
          e: 'git pull',
          next: () => {
            shell({
              e: 'git add .',
              next: () => {
                shell({
                  e: 'git commit -m "Update at ' + dateFormat('YYYY-MM-DD HH:mm:ss') + '"',
                  next: () => {
                    shell({ e: 'git push' })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})
