# Claude Code MCP 서버 설정 가이드

## 문제 발생 배경

2시간 이상 MCP 서버 연결 실패. 30번 이상 세션 재시작.

**원인**: Claude Code의 MCP 설정 구조에 대한 잘못된 안내와 혼란스러운 설정 파일 체계.

---

## 핵심 요약

**MCP 서버 추가 시 필요한 파일 2개:**

1. `.mcp.json` - MCP 서버 정의
2. `.claude/settings.local.json` - 서버 활성화

**이게 끝이다.**

---

## 설정 파일 구조 (정확한 정보)

### 사용하는 파일

| 파일 | 위치 | 용도 |
|------|------|------|
| `.mcp.json` | 프로젝트 루트 | MCP 서버 command, args 정의 |
| `.claude/settings.local.json` | 프로젝트 내 | `enabledMcpjsonServers`로 활성화 |

### 사용하지 않는 파일 (혼란 주의)

| 파일 | 설명 |
|------|------|
| `~/.claude.json` | 전역 설정. MCP는 여기에 넣지 않음 |
| `~/.claude/settings.json` | 전역 설정. MCP 설정 아님 |
| `.claude/settings.json` | 팀 공유용. MCP 활성화는 local.json에 |

---

## MCP 서버 추가 방법

### Step 1: `.mcp.json` 작성

프로젝트 루트에 생성:

```json
{
  "mcpServers": {
    "서버이름": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/server.js"],
      "env": {}
    }
  }
}
```

### Step 2: `.claude/settings.local.json` 작성

```json
{
  "enabledMcpjsonServers": ["서버이름"]
}
```

### Step 3: 확인

```bash
claude mcp list
```

`✓ Connected` 확인되면 완료.

---

## 여러 MCP 서버 추가 예시

### `.mcp.json`

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["dotenv", "-e", "/path/to/.env", "--", "node", "/path/to/n8n-mcp/dist/index.js"],
      "env": {}
    },
    "notion-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/notion-mcp/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "github-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/github-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

### `.claude/settings.local.json`

```json
{
  "enabledMcpjsonServers": ["n8n-mcp", "notion-mcp", "github-mcp"]
}
```

---

## 트러블슈팅

### "No MCP servers configured" 오류

1. `.mcp.json` 파일 존재 확인
2. `.claude/settings.local.json`에 `enabledMcpjsonServers` 확인
3. 서버 이름이 정확히 일치하는지 확인

### "Failed to connect" 오류

1. MCP 서버 빌드 확인: `ls dist/index.js`
2. 수동 실행 테스트: `node dist/index.js`
3. 환경변수 확인: `.env` 파일 존재 여부

### 설정 변경 후에도 안 될 때

```bash
# 현재 설정 확인
cat .mcp.json
cat .claude/settings.local.json

# MCP 연결 테스트
claude mcp list
```

---

## 하지 말아야 할 것

1. `~/.claude.json`에 직접 MCP 설정 추가하지 않기
2. `~/.claude/settings.json`에 MCP 설정 넣지 않기
3. `.claude/settings.json`에 `enabledMcpjsonServers` 넣지 않기 (local.json에 넣어야 함)
4. `claude mcp add` 명령어 사용하지 않기 (파일 직접 편집이 더 명확함)

---

## 현재 프로젝트 설정 (참고용)

### `.mcp.json`
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "dotenv",
        "-e",
        "/home/eohjun/projects/n8n-automation/.env",
        "--",
        "node",
        "/home/eohjun/projects/n8n-automation/n8n-mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

### `.claude/settings.local.json`
```json
{
  "enabledMcpjsonServers": ["n8n-mcp"]
}
```

---

## 문제 발생 원인 분석

### 잘못된 안내들

1. "`.mcp.json`에만 설정하면 됨" - **틀림**. `enabledMcpjsonServers` 필요
2. "`~/.claude/settings.json`에 설정" - **틀림**. MCP 설정 아님
3. "`.claude/settings.json`에 설정" - **틀림**. `settings.local.json`이 맞음
4. "`claude mcp add` 사용" - 작동하지만 `~/.claude.json`에 저장되어 혼란 야기

### Claude Code 설계 문제

- 설정 파일이 너무 많음 (5개 이상)
- `.mcp.json`이 자동 활성화되지 않음
- `enabledMcpjsonServers`가 별도로 필요하다는 게 직관적이지 않음
- 문서가 불명확함

---

작성일: 2025-12-02
