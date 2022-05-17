export const toDate = (d) => {
  if(d===null){
    return d;
  } else {
    var buf = d.split('-');
    return new Date(Number(buf[0]),Number(buf[1])-1,Number(buf[2]));
  }
}
