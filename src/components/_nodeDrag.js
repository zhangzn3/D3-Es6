export default function(force) {

    let dragstart = () => {
        d3.event.active || force.alphaTarget(.3).restart(),d3.event.subject.fx = d3.event.subject.x,d3.event.subject.fy = d3.event.subject.y;   
    };

    let dragmove = () => {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    };

    let dragend = () => {
        d3.event.active || force.alphaTarget(0),d3.event.subject.fx = null,d3.event.subject.fy = null;
    };

    return d3.drag().on("start", dragstart).on("drag", dragmove).on("end", dragend);
}

