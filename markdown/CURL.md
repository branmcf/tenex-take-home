```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/branmcf/tenex-take-home/issues \
  -d '{
    "title":"Task: wire up auth",
    "body":"- [ ] Add OAuth callback\n- [ ] Store session\n",
    "labels":["todo"],
    "assignees":["branmcf"]
  }'
  ```