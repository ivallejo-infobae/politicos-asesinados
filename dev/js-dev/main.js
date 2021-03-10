let btnPhoto = $(".politicians__photo-wrap");

if($(window).width() < 1024){
  btnPhoto.on('click', function(){
    let t = $(this);
    let text = t.parent().find(".text-info");
    let map = t.parent().find(".map");
    t.toggleClass("active");
    if (!t.hasClass("active")){
      text.fadeOut(300);
      map.fadeOut(300);
    } else {
      text.fadeIn(300);
      map.fadeIn(300);
    }
  })
}else {
  btnPhoto.on('click', function() {
    let t = $(this);
    let text = t.parent().find(".text-info");
    let map = t.parent().find(".map");
    t.toggleClass("active");
    if (!t.hasClass("active")){
      text.animate({
        left: "100%",
        opacity: 0
      }, 300);
      map.animate({
        right: "100%",
        opacity: 0
      }, 300);
    } else {
      text.animate({
        left: 0,
        opacity: 1
      }, 300);
      map.animate({
        right: 0,
        opacity: 1
      }, 300);
    }
  })
}



// btnPhoto.on('click', function() {
//   let t = $(this);
//   let text = t.parent().find(".text-info");
//   let map = t.parent().find(".map");
//   t.toggleClass("active");
//   if (!t.hasClass("active")){
//     // text.animate({
//     //   left: "100%",
//     //   opacity: 0
//     // }, 300);
//     text.fadeIn(200);
//     map.fadeIn(400);
//     // map.animate({
//     //   right: "100%",
//     //   opacity: 0
//     // }, 300);
//   } else {
//     text.animate({
//       left: 0,
//       opacity: 1
//     }, 300);
//     map.animate({
//       right: 0,
//       opacity: 1
//     }, 300);
//   }
// })
