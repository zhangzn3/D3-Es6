/**
 * Created by Administrator on 2017/5/27.
 */

export default function(force,tick,link,node,linetext){
    let dragstart=function(d, i) {
        force.stop();
        d3.event.sourceEvent.stopPropagation();
    };
    let dragmove=function(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick(link,linetext,node)
    };

    let dragend=function(d, i) {
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    };

    let _nodeDrag = d3.drag().on("start", dragstart).on("drag", dragmove).on("end", dragend);
    return _nodeDrag;
}