# 设置默认提交信息
commit_message="no comment"

# 如果提供了命令行参数，则使用它作为提交信息
if [ -n "$1" ]; then
  commit_message="$1"
fi

# 执行 git 操作
git add .
git commit -m "$commit_message"
git push origin