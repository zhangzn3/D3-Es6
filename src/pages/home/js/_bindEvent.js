import util from '../../../components/_util.js'; //公共方法

export default function(json, update, vis, force, node, link) {

    //下载excel
    d3.select("#J_ExportExcel").on("click", function() {
        util.exportExcel(json);
    });

    //侧边栏按钮切换
    d3.selectAll('.fn-toolbar .btn').on("click.toggle", function() {

        //清除增加节点事件和鼠标样式
        function unbindAddNode(){
            d3.select('.graph-area').on('click.add-node-ev', null).style("cursor", "default"); 
        }

        //清除增加连线的绑定事件
        function unbindAddLink(){
            node.on("mousedown.add-link",null);
            node.on("mouseup.add-link",null);
            d3.select(".graph-area").on("mousedown.add-link",null);
            d3.select(".graph-area").on("mousemove.add-link",null);
            d3.select(".graph-area").on("mouseup.add-link",null);
        }
        unbindAddNode();
        unbindAddLink();

        //按钮状态切换
        $(this).addClass('btn-primary selected').siblings().removeClass("btn-primary selected");
    })


    //添加节点
    d3.select('#J_AddNode').on("click.add-node", function() {
        d3.select('.graph-area').style("cursor", "crosshair"); //修改鼠标样式为"+"
        d3.select('.graph-area').on('click.add-node-ev', function() {
            let {translate,scale}=util.getTranslateAndScale();
            let [x, y] = d3.mouse(this);
            let newNodeId = +new Date()
            let newNode = { "id": newNodeId, "group": [], isNew: true };
            json.nodes.push(newNode);
            update(json);
            let [tx,ty]=[x/scale- +translate[0]/scale,y/scale- +translate[1]/scale];
            d3.select("g#node-" + newNodeId).attr("transform", `translate(${tx},${ty})`)
            .datum(Object.assign(d3.select("g#node-" + newNodeId).data()[0],{"x":tx,"y":ty}));
            force.stop();
        });
    });


    //删除节点
    d3.select('#J_DelNode').on("click.del-node", function() {
        __delNode(json, update);
    });


    //拖拽添加连线
    d3.select('#J_AddLink').on("click.add-link", function() {
        if ($(this).hasClass("selected")) {
            let mousedownNode = null,mouseupNode = null;
            let dragLine = vis.append("line").attr("class", "drag-line");
            node.on("mousedown.add-link", function(d) {
                    mousedownNode = d
                    dragLine.attr("class", "drag-line")
                        .lower()
                        .attr("x1", d["x"])
                        .attr("y1", d["y"])
                        .attr("x2", d["x"])
                        .attr("y2", d["y"])
                    d3.event.stopPropagation();
                })
                .on("mouseup.add-link", function(d) {
                    dragLine.attr("class", "drag-line-hidden")
                    if (mousedownNode) {
                        mouseupNode = d;
                        if (mouseupNode == mousedownNode) { mousedownNode = null;mouseupNode = null; return; }
                        let link = { source: mousedownNode, target: mouseupNode};
                        json.links.push(link);
                        update(json);
                    }
                })
            d3.select(".graph-area")
            .on("mousedown.add-link", function() {
                if (!mousedownNode) return;
            })
            .on('mousemove.add-link', function() {
                if (!mousedownNode) return;
                let {translate,scale}=util.getTranslateAndScale();
                let [x, y] = d3.mouse(this);
                dragLine.attr("x1", mousedownNode["x"])
                    .attr("y1", mousedownNode["y"])
                    .attr("x2", `${x/scale- +translate[0]/scale}`)
                    .attr("y2", `${y/scale- +translate[1]/scale}`);
                d3.event.preventDefault();
            })
            .on("mouseup.add-link", function() {
                if (mousedownNode) {
                    dragLine.attr("class", "drag-line-hidden")
                }
                mousedownNode = null;
                mouseupNode = null;
            });
        }
    });

    //删除连线
    d3.select('#J_DelLink').on("click.del-link", function() {
        __delLink(json, update);
    });
}


//删除节点
export function __delNode(json, update,selNode) {
    selNode = selNode || d3.selectAll('.node.active').data();
    if (selNode.length == 1) {
        json.nodes.forEach(function(d, i) {
            if (d["id"] == selNode[0].id) {
                json.nodes.splice(i, 1)
            }
        });
        json.links.forEach(function(d,i){
            if(d["source"]["id"]==selNode[0]["id"] || d["target"]["id"]==selNode[0]["id"]){
                json.links.splice(i,1)
            }   
        });
        update(json);
    } else {
        util.tip('请选择一个节点！');
    }
}

//删除连线
export function __delLink(json, update,selLink) {
    selLink = selLink || d3.selectAll('.link.active').data();
    if (selLink.length == 1) {
        json.links.forEach(function(d,i){
            if(d["source"]["id"]==selLink[0]["source"]["id"] && d["target"]["id"]==selLink[0]["target"]["id"]){
                json.links.splice(i,1)
            }   
        });
        update(json);
    } else {
        util.tip('请选择一条连线！');
    }
}