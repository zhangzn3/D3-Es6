/**
 * Created by Administrator on 2017/5/27.
 */

export default function(force,tick,link,node,linetext){
    let dragstart=(d, i)=>{
        force.stop();
        d3.event.sourceEvent.stopPropagation();
    };
    let dragmove=(d, i)=>{
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick(link,linetext,node);
    };
    let dragend=(d, i)=>{
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    };
    return d3.drag().on("start", dragstart).on("drag", dragmove).on("end", dragend);
}