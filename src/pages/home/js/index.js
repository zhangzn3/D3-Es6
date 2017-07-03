/**
 * Created by Administrator on 2017/6/17.
 */
import '../../../css/index.css'; //引入全局样式
/*注释部分移到dll.js依赖库*/
/*import "babel-polyfill";//兼容*/
/*import * as d3 from 'd3'; //引入D3*/
/*import svg2Png from 'save-svg-as-png'; //引入svg转png模块*/
/*import dialog from 'art-dialog';//引入art-dialog*/
import Mock from 'mockjs';//mock
import SimpleUndo from 'simple-undo'; //引入undo模块
import setupSlider from './_slider.js';//引入阈值模块
import _vis from './_vis.js'; //引入容器模块
import _force from './_force.js';//引入力导向模块
import _node from './_node.js';//引入节点模块
import _link from './_link.js';//引入连接线模块
import _linetext from './_linetext.js'; //引入关系文字模块
import _tp from './_tp.js';//引入右键菜单模块
import _nodeDrag from './_nodeDrag.js'; //引入节点拖拽模块
import _bindEvent from './_bindEvent.js';//工具栏操作
import _tick from './_tick.js';//引入更新坐标模块
let json=require('../data/data2.json');//获取数据
let vis=_vis();//创建svg视图
let force=_force(json);//力导向图布局
let bindEvent=_bindEvent(json,dialog,update,svg2Png);//绑定工具栏的操作事件
let tooltip=d3.select("body").append("div").attr("class", "tooltip");//添加悬浮窗元素
let dependsNode=[],dependsLinkAndText=[];

//节点显示隐藏
function highlightObject(obj){
    let allNode=vis.selectAll('.node'),allLink=vis.selectAll('.link'),allLineText=vis.selectAll('.linetext');
    if (obj) {
        let objIndex= obj.index;
        dependsNode=dependsNode.concat([objIndex]);
        dependsLinkAndText=dependsLinkAndText.concat([objIndex]);
        allNode.classed('inactive',(d)=>(dependsNode.indexOf(d.index) > -1));
        allLink.classed('inactive',(d)=>((dependsLinkAndText.indexOf(d.source.index) > -1) || (dependsLinkAndText.indexOf(d.target.index) > -1)));
        allLineText.classed('inactive',(d)=>((dependsLinkAndText.indexOf(d.source.index) > -1) || (dependsLinkAndText.indexOf(d.target.index) > -1)));
    } else {
        allNode.classed('inactive', false);
        allLink.classed('inactive', false);
        allLineText.classed('inactive', false);
    }
}

//权重过滤
function weightFilter(v1,v2){
    let allNode=vis.selectAll('.node'),allLink=vis.selectAll('.link'),allLineText=vis.selectAll('.linetext');
    v1=d3.select('.sel-range').attr('v1')||0;
    v2=d3.select('.sel-range').attr('v2')||10;
    allLink.classed('inactive',(d)=>(d.value<v1||d.value>v2));
    allLineText.classed('inactive',(d)=>(d.value<v1||d.value>v2));
}

//填充数据和绑定节点的事件
function update(json){
    //转换数据
    force.nodes(json.nodes);
    force.force("link").links(json.links);
    //生成节点、连接线、连接线文字以及绑定悬浮框事件
    let link=_link(json,vis);
    let node=_node(json,vis);
    let linetext=_linetext(json,vis);
    let tp=_tp(highlightObject,tooltip,dialog,json,update,weightFilter);

    //绑定悬浮窗事件
    tooltip.on('dblclick',()=>{
            d3.event.stopPropagation();
        })
        .on('mouseover',()=>{
            node.mouseoutTimeout&&clearTimeout(node.mouseoutTimeout);node.mouseoutTimeout = null;
        })
        .on('mouseout',()=>{
            node.mouseoutTimeout&&clearTimeout(node.mouseoutTimeout);node.mouseoutTimeout = null;
            node.mouseoutTimeout = setTimeout(()=>{tp.highlightToolTip(null);}, 300);
        });
    node.on('contextmenu',d=>{
            node.mouseoutTimeout&&clearTimeout(node.mouseoutTimeout);node.mouseoutTimeout = null;
            tp.highlightToolTip(d);
            d3.event.preventDefault();
            d3.event.stopPropagation();
        })
        .on('mouseover',(d)=>{node.mouseoutTimeout&&clearTimeout(node.mouseoutTimeout);node.mouseoutTimeout = null;})
        .on('mouseout',()=>{
            node.mouseoutTimeout&&clearTimeout(node.mouseoutTimeout);node.mouseoutTimeout = null;
            node.mouseoutTimeout = setTimeout( ()=>{tp.highlightToolTip(null)}, 300);
        })
        .call(_nodeDrag(force,_tick,link,node,linetext));
    link.on('contextmenu',d=>{
        tp.highlightToolTip(d);
        d3.event.preventDefault();
        d3.event.stopPropagation();
    });
    //阈值模块初始化
    setupSlider(0,10,weightFilter);
    //重启模拟
    force.restart();

    //更新坐标函数
    force.on("tick",()=>{_tick(link,linetext,node)});
}
update(json);

//双击页面还原隐藏的元素
d3.select("body").on('dblclick',()=>{
    dependsNode = dependsLinkAndText = [];
    highlightObject(null);
    setupSlider(0,10,weightFilter);
    force.restart();
});









