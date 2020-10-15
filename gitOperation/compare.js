const path = require('path');
const fs = require('fs');
const { exec, cd, test } = require('shelljs');


// 组件仓库名列表
const allComponents = {
  en: [
    // 'en_answer-machine',
    // 'en_light-group-follow-up',
    // 'en_group-follow-up',
    // 'en_state-groupqa-hasbranch',
    // 'en_state-groupqa-nobranch',
    // 'en_magic-hat',
    // 'en_light-follow-up-avatar',
    // 'en_voice-error-correction',
    // 'en_one-to-one-handsup',
    // 'en_one-to-one-point',
    // 'en_one-to-one-handsup-pro',
    // 'en_one-to-one-point-pro',
    // 'en_countdown',
    // 'en_grab-red-packet-bird',
    // 'en_state-divide-group',
    // 'en_state-volume-pk',
    // 'general_list-on-the-wall',
    // 'general_list-of-honor',
    // 'en_picture-talk-show',
    // 'en_role-play',
    // 'en_parent-said',
    // 'en_summary-after-class',
    // 'en_winning-team',
    // 'en_state-volume-pro-pk',
    // 'en_state-divide-group-pro',
    'en_light-follow-up-avatar-praise',
  ],
};

const compDir = path.join(__dirname, '../src/course/component/');
// let type = true;
let type = false;
if (type) {
  Object.keys(allComponents).forEach((subject) => {
    allComponents[subject].forEach((component) => {
      const destDir = path.join(compDir, component);
      cd(destDir)
      exec('git fetch')
      exec('git checkout -b master_aibrowser_api_compatible origin/master_aibrowser_api_compatible');
      exec('git checkout master_aibrowser_api_compatible');
      exec('git pull')
    });
  });
} else {

// 修改文件
const components = path.join(__dirname, '..', 'src', 'course', 'component');
const entries = { }
const entriesArr = []
subFileNames = fs.readdirSync(components);
subFileNames.forEach(subFileName => {
  const sub = path.join(components, subFileName)

  const stats = fs.statSync(sub);
  if (stats.isDirectory()) {
    entries[(`${sub.substring(sub.indexOf(`course${path.sep}`), sub.length)}${path.sep}index`).replace(/\\/g, "/")] = path.join(sub, 'index.ts');
    entriesArr.push(path.join(sub, 'index.ts'))
  }
})

// console.log(entriesArr)
entriesArr.forEach((item, index) => {
    fs.appendFileSync(item, "//\n")
})

// 提交git 并cherry-pick分支
Object.keys(allComponents).forEach((subject) => {
    allComponents[subject].forEach((component) => {
      const destDir = path.join(compDir, component);
      console.log(destDir)
      cd(destDir)
      exec('git checkout master_aibrowser_api_compatible');
      exec('git pull')
      exec('git add index.ts')
      exec('git commit -m "互动兼容跟双师的融合环境和原Phoenix环境,ajax请求修改" --no-verify')
      exec('git push')
      const commitId = exec('git rev-parse HEAD')
      console.log("commitId" + commitId)
      exec('git checkout changebridge');
      exec('git pull');
      exec(`git cherry-pick ${commitId}`)
      exec('git push')
    });
  });
}