import gulp from 'gulp'
import fs from 'node:fs'
import path from 'node:path'
import through from 'through2'

const doNotEditMessage =
  '//- ВНИМАНИЕ! Этот файл генерируется автоматически.\n//- Любые изменения будут потеряны при следующей компиляции.\n\n'

const generatePugMixins = () => {
  const source = `${process.cwd()}${path.sep}src${path.sep}pug${path.sep}`
  const files = []
  return through.obj((file, enc, callback) => {
    file = file.path.replace(source, '')
    let mixinsList = doNotEditMessage.replace(/\n /gm, '\n  ')
    files.push(file)
    files.sort()
    for (const blockName of files) {
      mixinsList += `include ${blockName}\n`
    }
    fs.writeFileSync('src/pug/mixins.pug', mixinsList)
    callback(undefined, file)
  })
}

function pugMixins() {
  return gulp
    .src([
      'src/pug/**/*.pug',
      '!src/pug/blocks/header/*',
      '!src/pug/blocks/footer/*',
      '!src/pug/mixins.pug'
    ])
    .pipe(generatePugMixins())
}

export { pugMixins }
