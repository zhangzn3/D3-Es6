import svg2png from "save-svg-as-png"; //引入svg转png模块
export default function(){
   d3.select("#J_ExportPng").on("click",function(){
     if($("#J_SvgView").size()){
     	let $all=$(".all"),$graphArea=$('.graph-area');
     	let transform=$all.attr("transform");
     	let scale=(transform && /scale/.test(transform)) ? (+ transform.match(/scale\(([^\)]+)\)/)[1]):1;
     	let allPos=$all[0].getBoundingClientRect();
     	let left=allPos.left-$graphArea.offset().left-15*scale;
     	let top=allPos.top-$graphArea.offset().top;
     	let width=allPos.width+30*scale;
    	let height=allPos.height;
    	svg2png.saveSvgAsPng($("#J_SvgView")[0],`图片预览${+new Date()}.png`,{left,top,width,height})
     }
   });
}