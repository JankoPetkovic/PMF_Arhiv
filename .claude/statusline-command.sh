#!/bin/sh
# Claude Code status line script
# Shows: model, context usage, cost (tokens), and status flags

input=$(cat)

# Model
model=$(echo "$input" | jq -r '.model.display_name // "Unknown Model"')

# Context usage
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
if [ -n "$used_pct" ]; then
  ctx=$(printf "Ctx: %.0f%%" "$used_pct")
else
  ctx="Ctx: --"
fi

# Token cost info (input + output tokens from last call)
cur=$(echo "$input" | jq -r '.context_window.current_usage // empty')
if [ -n "$cur" ] && [ "$cur" != "null" ]; then
  in_tok=$(echo "$input" | jq -r '.context_window.current_usage.input_tokens // 0')
  out_tok=$(echo "$input" | jq -r '.context_window.current_usage.output_tokens // 0')
  cache_write=$(echo "$input" | jq -r '.context_window.current_usage.cache_creation_input_tokens // 0')
  cache_read=$(echo "$input" | jq -r '.context_window.current_usage.cache_read_input_tokens // 0')
  tokens=$(printf "In:%s Out:%s Cache(w:%s r:%s)" "$in_tok" "$out_tok" "$cache_write" "$cache_read")
else
  tokens="Tokens: --"
fi

# Status flags: thinking, effort, vim mode
status=""

thinking=$(echo "$input" | jq -r '.thinking.enabled // false')
if [ "$thinking" = "true" ]; then
  status="${status}[Thinking] "
fi

effort=$(echo "$input" | jq -r '.effort.level // empty')
if [ -n "$effort" ]; then
  status="${status}[Effort: $effort] "
fi

vim_mode=$(echo "$input" | jq -r '.vim.mode // empty')
if [ -n "$vim_mode" ]; then
  status="${status}[VIM: $vim_mode] "
fi

# Assemble output
out="$model | $ctx | $tokens"
if [ -n "$status" ]; then
  out="$out | $status"
fi

printf "%s" "$out"
