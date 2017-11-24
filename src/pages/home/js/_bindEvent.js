import util from '../../../components/_util.js'; //公共方法

export default function(json, update, vis, force) {

    //下载excel
    d3.select("#J_ExportExcel").on("click", function() {
        util.exportExcel(json);
    });

    //侧边栏按钮切换
    d3.selectAll('.fn-toolbar .btn').on("click.toggle",function(){
        d3.select('.graph-area').on('click.add-node-ev', null).style("cursor", "default"); //清除增加节点事件和鼠标样式
        $(this).addClass('btn-primary selected').siblings().removeClass("btn-primary selected");
    })


    //添加节点
    d3.select('#J_AddNode').on("click.add-node", function() {
        d3.select('.graph-area').style("cursor", "crosshair"); //修改鼠标样式为"+"
        d3.select('.graph-area').on('click.add-node-ev', function() {
            let transform = $(".all").attr("transform");
            let matchArr=transform && /translate/.test(transform) && /scale/.test(transform) && transform.match(/translate\(([^\)]+)\)\s?scale\(([^\)]+)/);
            let translate = matchArr && matchArr[1].split(",") || [0, 0]
            let scale = matchArr && matchArr[2] || 1;
            let [x, y] = d3.mouse(this);
            let newNodeId = +new Date()
            let newNode = { "id": newNodeId, "group": [] ,isNew:true};
            json.nodes.push(newNode);
            update(json);
            d3.select("g#node-" + newNodeId).attr("transform", `translate(${x/scale- +translate[0]/scale},${y/scale- +translate[1]/scale})`);
            force.stop();
        });
    });

    //删除节点
    d3.select('#J_DelNode').on("click.del-node", function() {
         __delNode(json,update);
    });   

    //添加连线
    d3.select('#J_AddLink').on("click.add-link", function() {
        
    });   

}

//删除节点
export function __delNode(json,update){
        let selNode = d3.selectAll('.node.active');
        if (selNode.size() == 1) {
            json.nodes.forEach(function(d, i) {
                if (d["id"] == selNode.data()[0].id) {
                  json.nodes.splice(i,1)
                }
            });
            update(json);
        } else {
            util.tip('请选择一个节点！');
        }
}