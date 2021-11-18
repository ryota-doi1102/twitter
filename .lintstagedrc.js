module.exports = {
  '*.tsx, *.ts': ['eslint --max-warnings=0 --fix', 'prettier -cw --write'],
  '*.scss': ['stylelint --max-warnings=0 --fix'],
};
