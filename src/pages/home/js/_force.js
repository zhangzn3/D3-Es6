export default function(json){
    return d3.forceSimulation([])
        .force("link", d3.forceLink([]).id((d)=>(d.id)).distance(100))//以哪个字段来作为link指向
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter( window.innerWidth / 2,  window.innerHeight / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge",d3.forceManyBody())
        .force("collide",d3.forceCollide(60).strength(0.2).iterations(5))
}

