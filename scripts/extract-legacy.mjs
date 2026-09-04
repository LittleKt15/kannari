import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const root = path.resolve('../kannari')
const read = (name) => fs.readFileSync(path.join(root, 'src/app', name, 'page.tsx'), 'utf8')
function array(source, name) {
  const ast = ts.createSourceFile(
    'source.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  let result
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === name && node.initializer)
      result = JSON.parse(JSON.stringify(Function(`return (${node.initializer.getText(ast)})`)()))
    ts.forEachChild(node, visit)
  }
  visit(ast)
  return result
}
const clean = (str) =>
  str
    .replace(/<[^>]+>/g, '')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
function paragraphs(source) {
  return [
    ...source.matchAll(
      /<p\s+className="text-base sm:text-lg leading-relaxed text-gray-300[^\"]*">([\s\S]*?)<\/p>/g,
    ),
  ].map((m) => clean(m[1]))
}
const data = {
  logos1: array(read('home'), 'logos1'),
  logos2: array(read('home'), 'logos2'),
  projects: array(read('work'), 'workItems'),
  services: array(read('services'), 'services'),
  aboutGallery: array(read('about'), 'galleryImages'),
  serviceGallery: array(read('services'), 'galleryImages'),
  homeText: paragraphs(read('home')),
  aboutText: paragraphs(read('about')),
  contactText: paragraphs(read('contact')),
  servicesText: clean(read('services').match(/<p>([\s\S]*?)<\/p>/)[1]),
}
fs.mkdirSync('seed', { recursive: true })
fs.writeFileSync('seed/content.json', JSON.stringify(data, null, 2))
fs.cpSync(path.join(root, 'public'), 'seed/assets', { recursive: true })
fs.mkdirSync('public', { recursive: true })
for (const name of ['logo.svg', 'facebook.svg', 'instagram.svg', 'linkedin.svg', 'v.svg'])
  fs.copyFileSync(path.join(root, 'public', name), path.join('public', name))
console.log('Copied portfolio content and source assets.')
