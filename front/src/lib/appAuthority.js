// 権限リスト
export const appAuthorities = [
  { id: "auth0001", name: "一般" },
  { id: "auth0002", name: "一般＋内部監査" },
  { id: "auth0003", name: "一般＋内部監査＋PJ承認" },
  { id: "auth0004", name: "統括部門" },
  { id: "sysadmin", name: "システム管理者" },
]

// 権限取得
export const setAuhority = (auth) => {
  switch (auth) {
    case "sysadmin":
      return sysadmin;
    case "auth0001":
      return auth0001;
    case "auth0002":
      return auth0002;
    case "auth0003":
      return auth0003;
    case "auth0004":
      return auth0004;
    default:
      return auth0001;
  }
}

// システム管理者権限
export const sysadmin = {
  orgAuth: true,          // 組織整備可能
  prjDelAddAuth: true,    // プロジェクト登録・削除可能
  prjAuditAuth: true,     // プロジェクト監査可能
}

// 一般権限
export const auth0001 = {
  orgAuth: false,          // 組織整備不可
  prjDelAddAuth: false,    // プロジェクト登録・削除不可
  prjAuditAuth: false,     // プロジェクト監査不可
}

// 一般+内部監査権限
export const auth0002 = {
  orgAuth: false,          // 組織整備不可
  prjDelAddAuth: false,    // プロジェクト登録・削除不可
  prjAuditAuth: true,      // プロジェクト監査可能
}

// 一般+内部監査+PJ承認
export const auth0003 = {
  orgAuth: false,          // 組織整備不可
  prjDelAddAuth: true,     // プロジェクト登録・削除可能
  prjAuditAuth: true,      // プロジェクト監査可能
}

// 統括部門権限
export const auth0004 = {
  orgAuth: true,           // 組織整備可能
  prjDelAddAuth: false,    // プロジェクト登録・削除不可
  prjAuditAuth: false,     // プロジェクト監査不可
}


