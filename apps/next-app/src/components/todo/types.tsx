export type OperatorType = 'add' | 'progress' | 'edit' | 'copy' | 'add-note';

export const operatorMap: Record<OperatorType, string> = {
  progress: '添加进度',
  edit: '编辑',
  copy: '复制',
  add: '新增',
  'add-note': '添加备注'
}
