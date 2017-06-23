/**
 * Created by Administrator on 2017/6/17.
 */
import '../../../css/index.css'; //引入全局样式
import * as d3 from 'd3'; //引入D3
import svg2Png from 'save-svg-as-png'; //引入svg转png模块
import dialog from 'art-dialog';//引入art-dialog
import _vis from './_vis.js'; //引入容器模块
import _force from './_force.js';//引入力导向模块
import _node from './_node.js';//引入节点模块
import _link from './_link.js';//引入连接线模块
import _linetext from './_linetext.js'; //引入关系文字模块
import _tp from './_tp.js';//引入右键菜单模块
import _nodeDrag from './_nodeDrag.js'; //引入节点拖拽模块
import _bindEvent from './_bindEvent.js';//工具栏操作
import _tick from './_tick.js';//引入更新坐标模块
let json=require('../data/data1.json');//获取数据

//获取各模块返回值
let vis=_vis();
let force=_force(json);
let bindEvent=_bindEvent(json,dialog,update,svg2Png);
let dependsNode=[],dependsLinkAndText=[];

//收起
function highlightObject(obj){
    let allNode=vis.selectAll('.node'),allLink=vis.selectAll('.link'),allLineText=vis.selectAll('.linetext');
    if (obj) {
        var objIndex= obj.index;
        dependsNode=dependsNode.concat([objIndex]);
        dependsLinkAndText=dependsLinkAndText.concat([objIndex]);
        allNode.classed('inactive',function(d){
            return (dependsNode.indexOf(d.index) > -1)
        });
        allLink.classed('inactive', function(d) {
            return ((dependsLinkAndText.indexOf(d.source.index) > -1) || (dependsLinkAndText.indexOf(d.target.index) > -1))
        });
        allLineText.classed('inactive',function(d){
            return ((dependsLinkAndText.indexOf(d.source.index) > -1) || (dependsLinkAndText.indexOf(d.target.index) > -1))
        });
    } else {
        allNode.classed('inactive', false);
        allLink.classed('inactive', false);
        allLineText.classed('inactive', false);
    }
}

//填充数据和绑定节点的事件
function update(json){
    //转换数据
    force.nodes(json.nodes);
    force.force("link").links(json.links);

    let link=_link(json,vis);
    let node=_node(json,vis);
    let linetext=_linetext(json,vis);
    let nodeDrag=_nodeDrag(force,_tick,link,node,linetext);
    let tp=_tp(highlightObject);
    tp.tooltip.on('dblclick', function () {
            d3.event.stopPropagation();
        })
        .on('mouseover', function () {
            if (node.mouseoutTimeout) {
                clearTimeout(node.mouseoutTimeout);
                node.mouseoutTimeout = null;
            }
        })
        .on('mouseout', function () {
            if (node.mouseoutTimeout) {
                clearTimeout(node.mouseoutTimeout);
                node.mouseoutTimeout = null;
            }
            node.mouseoutTimeout = setTimeout(function () {
                tp.highlightToolTip(null);
            }, 300);
        });
    node.on('contextmenu', function (d) {
            if (node.mouseoutTimeout) {
                clearTimeout(node.mouseoutTimeout);
                node.mouseoutTimeout = null;
            }
            tp.highlightToolTip(d);
            d3.event.preventDefault();
            d3.event.stopPropagation();
        })
        .on('mouseover', function(d) {
            if (node.mouseoutTimeout) {
                clearTimeout(node.mouseoutTimeout);
                node.mouseoutTimeout = null;
            }
        })
        .on('mouseout', function () {
            if (node.mouseoutTimeout) {
                clearTimeout(node.mouseoutTimeout);
                node.mouseoutTimeout = null;
            }
            node.mouseoutTimeout = setTimeout(function () {
                tp.highlightToolTip(null);
            }, 300);
        })
        .call(_nodeDrag(force,_tick,link,node,linetext));

    //更新坐标函数
    force.on("tick",function(){
        _tick(link,linetext,node);
    });

    force.restart();
}
update(json);

//双击页面
d3.select("body").on('dblclick', function () {
    dependsNode = dependsLinkAndText = [];
    highlightObject(null);
    force.restart();
});





