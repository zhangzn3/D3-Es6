/**
 * Created by Administrator on 2017/5/27.
 */

export default function(json){
    return d3.forceSimulation(json.nodes)
        .force("link", d3.forceLink(json.links).distance(100))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter( window.innerWidth / 2,  window.innerHeight / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge",d3.forceManyBody())
        .force("collide",d3.forceCollide(60).strength(0.2).iterations(5))
}

