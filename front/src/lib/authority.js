// システム管理者権限
export const masterAuth = {
  depindex: true,
  depnew: true,
  depupdate: true,
  depdelete : true,
  divindex: true,
  divnew: true,
  divupdate: true,
  divdelete: true,
  empindex: true,
  empshow: true,
  empupdate: true,
  empdelete: true,
  prjindex: true,
  prjshow: true,
  prjnew: true,
  prjcreate: true,
  prjmodify: true,
  prjdelete: true,
  prjaudit: true,
  repshow: true,
  repcreate: true,
  repaudit: true,
  taskentry: true,
  dailyindex: true,
  dailyselect: true,
  proguserindex: true,
  progmanaindex: true
}

// 全権限なし
export const initAuth = {
  depindex: false,
  depnew: false,
  depupdate: false,
  depdelete : false,
  divindex: false,
  divnew: false,
  divupdate: false,
  divdelete: false,
  empindex: false,
  empshow: false,
  empupdate: false,
  empdelete: false,
  prjindex: false,
  prjshow: false,
  prjnew: false,
  prjcreate: false,
  prjmodify: false,
  prjdelete: false,
  prjaudit: false,
  repshow: false,
  repcreate: false,
  repaudit: false,
  taskentry: false,
  dailyindex: false,
  dailyselect: false,
  proguserindex: false,
  progmanaindex: false
}

// 一般権限
export const normalAuth = {
  depindex: true,
  depnew: false,
  depupdate: false,
  depdelete : false,
  divindex: true,
  divnew: false,
  divupdate: false,
  divdelete: false,
  empindex: true,
  empshow: true,
  empupdate: false,
  empdelete: false,
  prjindex: true,
  prjshow: true,
  prjnew: false,
  prjcreate: true,
  prjmodify: true,
  prjdelete: false,
  prjaudit: false,
  repshow: true,
  repcreate: true,
  repaudit: false,
  taskentry: true,
  dailyindex: true,
  dailyselect: false,
  proguserindex: true,
  progmanaindex: true
}

// 内部監査権限
export const auditAuth = {
  depindex: true,
  depnew: false,
  depupdate: false,
  depdelete : false,
  divindex: true,
  divnew: false,
  divupdate: false,
  divdelete: false,
  empindex: true,
  empshow: true,
  empupdate: false,
  empdelete: false,
  prjindex: true,
  prjshow: true,
  prjnew: false,
  prjcreate: true,
  prjmodify: true,
  prjdelete: false,
  prjaudit: true,
  repshow: true,
  repcreate: true,
  repaudit: true,
  taskentry: true,
  dailyindex: true,
  dailyselect: false,
  proguserindex: true,
  progmanaindex: true
}

// 管理職権限
export const managerAuth = {
  depindex: true,
  depnew: false,
  depupdate: false,
  depdelete : false,
  divindex: true,
  divnew: false,
  divupdate: false,
  divdelete: false,
  empindex: true,
  empshow: true,
  empupdate: false,
  empdelete: false,
  prjindex: true,
  prjshow: true,
  prjnew: true,
  prjcreate: true,
  prjmodify: true,
  prjdelete: true,
  prjaudit: true,
  repshow: true,
  repcreate: true,
  repaudit: true,
  taskentry: true,
  dailyindex: true,
  dailyselect: true,
  proguserindex: true,
  progmanaindex: true
}

// 組織管理権限
export const organizationAuth = {
  depindex: true,
  depnew: true,
  depupdate: true,
  depdelete : true,
  divindex: true,
  divnew: true,
  divupdate: true,
  divdelete: true,
  empindex: true,
  empshow: true,
  empupdate: true,
  empdelete: true,
  prjindex: true,
  prjshow: true,
  prjnew: false,
  prjcreate: true,
  prjmodify: true,
  prjdelete: false,
  prjaudit: false,
  repshow: true,
  repcreate: true,
  repaudit: false,
  taskentry: false,
  dailyindex: true,
  dailyselect: false,
  proguserindex: true,
  progmanaindex: true
}

export const setAuhority = (authority) => {
  if(authority==="master"){
    return masterAuth;
  } else if(authority==="audit"){
    return auditAuth;
  } else if(authority==="manager"){
    return managerAuth;
  } else if(authority==="organization"){
    return organizationAuth;
  } else {
    return masterAuth;
  }
}
