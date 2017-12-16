import "babel-polyfill"; //兼容
import '../../../css/index.css'; //引入自定义样式
import API from "../../../components/api.js"; //模拟数据
import util from '../../../components/_util.js'; //公共方法
import _vis from '../../../components/_vis.js'; //容器模块
import _link from '../../../components/_link.js'; //连接线模块
import _node from '../../../components/_node.js'; //节点模块
import _tick from '../../../components/_tick.js'; //更新坐标模块
import _nodeDrag from '../../../components/_nodeDrag.js'; //节点拖拽模块
import _force from '../../../components/_force.js'; //力导向模块
import _linetext from '../../../components/_linetext.js'; //引入关系文字模块
import _exportPng from '../../../components/_exportPng.js'; //导出图片模块
import _bindEvent from './_bindEvent.js'; //绑定工具栏操作事件
import _bindLinkAndNodeEvent from './_bindLinkAndNodeEvent.js'; //绑定节点和连接线操作事件

//绘图数据获取 
API.getData().then(function(rps) {
    if (rps["success"] && rps["result"]) {
        let json = Object.prototype.toString.call(rps["result"]) == "[object String]" ? JSON.parse(rps["result"]) : rps["result"];
        graphInit(json);
    }
});

//绘图初始化
function graphInit(json) {
    let vis = _vis(); //创建svg视图
    let force = _force(); //力导向图布局
    let exportPng = _exportPng(); //导出图片
    function update() {
        //转换数据
        force.nodes(json["nodes"]);
        force.force("link").links(json["links"]);
        //生成节点连接线
        let link = _link(json, vis);
        let node = _node(json, vis);
        let linetext = _linetext(json, vis);
        let bindEvent = _bindEvent(json, update, vis, force, node, link);
        let bindLinkAndNodeEvent = _bindLinkAndNodeEvent(json, update, vis, node, link);
        //node.call(_nodeDrag(force));//绑定拖拽
        force.on('tick', () => (_tick(link, node, linetext)))
    }
    force.alphaTarget(.1);
    force.restart();
    update(json);
    util.autoZoom(json); //自动缩放
}