let options={
  weekday:'long',
  day:'numeric',
  month:'long'
};
let today = new Date();
module.exports=today.toLocaleDateString("us-EN",options);
