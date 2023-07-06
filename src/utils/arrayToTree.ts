export default function(arr: Array<any>, idKey: string, fidKey: string, childKey: string = 'children', startFid: any = 0) {
	function updateChildren(node: any) {
		let children = arr.filter(item => item[fidKey] === node[idKey]);
		if(children.length === 0) return;
		node[childKey] = [];
		children.forEach(item => {
			let temp = {...item};
			updateChildren(temp);
			node[childKey].push(temp);
		});
	}
	var result: Array<any> = [];
	var top = arr.filter(item => item[fidKey] === startFid);
	top.forEach(item => {
		let temp = {...item};
		updateChildren(temp);
		result.push(temp);
	});
	return result;
}

// export default function(arr: Array<any>, idKey: string, fidKey: string, childKey: string = 'children', startFid: any = 0) {
// 	return (function(fid) {
// 		let result: Array<any> = [];
// 		let children = arr.filter(item => item[fidKey] === fid);
// 		if(children.length === 0) return result;
// 		children.forEach(child => {
// 			let temp = {...child};
// 			let tempChildren = arguments.callee(temp[idKey]);
// 			if(tempChildren.length > 0) temp[childKey] = tempChildren;
// 			result.push(temp);
// 		});
// 		return result;
// 	})(startFid);
// }