

function SD(){
	this.sdArr = [];	
	this.errorArr = [];
	this.blankNum = 25;
	this.backupSdArr = [];
}

SD.prototype={
	constructor:SD,
	init:function(blankNum){
		this.createDoms();
		var beginTime = new Date().getTime();
		this.createSdArr();
		console.log("數據生成完畢，耗時:"+((new Date().getTime())-beginTime)/1000+"秒！");
				this.blankNum = this.setLevel()||blankNum || this.blankNum;		
		this.drawCells();
		this.createBlank(this.blankNum);
		this.createBlankCells();
	},
	reset:function(){
	
		this.errorArr = [];
		$(".sdspan").removeClass('bg_red blankCell');
		var beginTime = new Date().getTime();
		this.createSdArr();
		console.log("數據生成完畢，耗時:"+((new Date().getTime())-beginTime)/1000+"秒！");
		this.blankNum = this.setLevel()||this.blankNum;
		$(".sdspan[contenteditable=true]").prop('contenteditable',false);
		this.drawCells();
		this.createBlank(this.blankNum);
		this.createBlankCells();
	},
	again:function(){
		
		this.errorArr = [];
		$(".sdspan").removeClass('bg_red blankCell');		
		this.createBlankCells();
	},
	setLevel:function(){
		
		return 25;
	},
	createSdArr:function(){
		
		var that = this;
		try{
			this.sdArr = [];
			this.setThird(2,2);
			this.setThird(5,5);
			this.setThird(8,8);
			var allNum = [1,2,3,4,5,6,7,8,9];
			outerfor:
			for(var i=1;i<=9;i++){
				innerfor:
				for(var j=1;j<=9;j++){
					if(this.sdArr[parseInt(i+''+j)]){
						continue innerfor;
					}
					var XArr = this.getXArr(j,this.sdArr);
					var YArr = this.getYArr(i,this.sdArr);
					var thArr = this.getThArr(i,j,this.sdArr);
					var arr = getConnect(getConnect(XArr,YArr),thArr);
					var ableArr = arrMinus(allNum,arr);

					if(ableArr.length == 0){
						this.createSdArr();
						return;
						break outerfor;
					}

					var item;
					
					do{
						item = ableArr[getRandom(ableArr.length)-1];
					}while(($.inArray(item, arr)>-1));

					this.sdArr[parseInt(i+''+j)] = item;
				}
			}
			this.backupSdArr = this.sdArr.slice();
		}catch(e){
			
			that.createSdArr();
		}
	},
	getXArr:function(j,sdArr){
		
		var arr = [];
		for(var a =1;a<=9;a++){
			if(this.sdArr[parseInt(a+""+j)]){
				arr.push(sdArr[parseInt(a+""+j)])
			}
		}
		return arr;
	},
	getYArr:function(i,sdArr){
		
		var arr = [];
		for(var a =1;a<=9;a++){
			if(sdArr[parseInt(i+''+a)]){
				arr.push(sdArr[parseInt(i+''+a)])
			}
		}
		return arr;
	},
	getThArr:function(i,j,sdArr){
		
		var arr = [];
		var cenNum = this.getTh(i,j);
		var thIndexArr = [cenNum-11,cenNum-1,cenNum+9,cenNum-10,cenNum,cenNum+10,cenNum-9,cenNum+1,cenNum+11];
		for(var a =0;a<9;a++){
			if(sdArr[thIndexArr[a]]){
				arr.push(sdArr[thIndexArr[a]]);
			}
		}
		return arr;
	},
	getTh:function(i,j){
		
		var cenArr = [22,52,82,25,55,85,28,58,88];
		var index = (Math.ceil(j/3)-1) * 3 +Math.ceil(i/3) -1;
		var cenNum = cenArr[index];
		return cenNum;
	},
	setThird:function(i,j){
		
		var numArr = [1,2,3,4,5,6,7,8,9];
		var sortedNumArr= numArr.sort(function(){return Math.random()-0.5>0?-1:1});
		var cenNum = parseInt(i+''+j);
		var thIndexArr = [cenNum-11,cenNum-1,cenNum+9,cenNum-10,cenNum,cenNum+10,cenNum-9,cenNum+1,cenNum+11];
		for(var a=0;a<9;a++){
			this.sdArr[thIndexArr[a]] = sortedNumArr[a];
		}
	},
	drawCells:function(){
		
		for(var j =1;j<=9;j++){
			for(var i =1;i<=9;i++){					
				$(".sdli").eq(j-1).find(".sdspan").eq(i-1).html(this.sdArr[parseInt(i+''+j)]);
			}
		}
	},
	createBlank:function(num){
		
		var blankArr = [];
		var numArr = [1,2,3,4,5,6,7,8,9];
		var item;
		for(var a =0;a<num;a++){
			do{
				item = parseInt(numArr[getRandom(9) -1] +''+ numArr[getRandom(9) -1]);
			}while($.inArray(item, blankArr)>-1);
			blankArr.push(item);
		}
		this.blankArr = blankArr;
	},
	createBlankCells:function(){
		
		var blankArr = this.blankArr,len = this.blankArr.length,x,y,dom;

		for(var i =0;i<len;i++){
			x = parseInt(blankArr[i]/10);
			y = blankArr[i]%10;	
			dom = $(".sdli").eq(y-1).find(".sdspan").eq(x-1);
			dom.attr('contenteditable', true).html('').addClass('blankCell');		
			this.backupSdArr[blankArr[i]] = undefined;
		}

		$(".sdspan[contenteditable=true]").keyup(function(event) {
			var val = $(this).html();			
			var reStr = /^[1-9]{1}$/;
			if(!reStr.test(val)){
				$(this).html('');
			};
		});
	},
	checkRes:function(){
		
		var blankArr = this.blankArr,len = this.blankArr.length,x,y,dom,done,temp;
		this.getInputVals();
		this.errorArr.length = 0;
		for(var i =0;i<len;i++){
			x = parseInt(blankArr[i]/10);
			y = blankArr[i]%10;
			temp = this.backupSdArr[blankArr[i]];
			this.backupSdArr[blankArr[i]] = undefined;
			this.checkCell(x,y);
			this.backupSdArr[blankArr[i]] = temp;

		}
		done = this.isAllInputed();
		if(this.errorArr.length == 0 && done ){
			alert("成功!");
			$(".bg_red").removeClass('bg_red');
		}else{
			if(!done){
				alert("尚未完成！");
			}
			this.showErrors();
		}
	},
	checkCell:function(i,j){
		
		var index = parseInt(i+''+j);
		var backupSdArr = this.backupSdArr;
		var XArr = this.getXArr(j,backupSdArr);
		var YArr = this.getYArr(i,backupSdArr);
		var thArr = this.getThArr(i,j,backupSdArr);
		var arr = getConnect(getConnect(XArr,YArr),thArr);			
		var val = parseInt($(".sdli").eq(j-1).find(".sdspan").eq(i-1).html());
		if($.inArray(val, arr)>-1){
			this.errorArr.push(index);
		}
	},
	getInputVals:function(){
		
		var blankArr = this.blankArr,len = this.blankArr.length,i,x,y,dom,theval;
		for(i=0;i<len;i++){
			x = parseInt(blankArr[i]/10);
			y = blankArr[i]%10;	
			dom = $(".sdli").eq(y-1).find(".sdspan").eq(x-1);
			theval = parseInt(dom.text())||undefined;
			this.backupSdArr[blankArr[i]] = theval;
		}
	},
	isAllInputed:function(){
		
		var blankArr = this.blankArr,len = this.blankArr.length,i,x,y,dom;
		for(i=0;i<len;i++){
			x = parseInt(blankArr[i]/10);
			y = blankArr[i]%10;	
			dom = $(".sdli").eq(y-1).find(".sdspan").eq(x-1);
			if(dom.text()==''){
				return false
			}
		}
		return true;
	},
	showErrors:function(){
		
		var errorArr = this.errorArr,len = this.errorArr.length,x,y,dom;
		$(".bg_red").removeClass('bg_red');
		for(var i =0;i<len;i++){
			x = parseInt(errorArr[i]/10);
			y = errorArr[i]%10;	
			dom = $(".sdli").eq(y-1).find(".sdspan").eq(x-1);
			dom.addClass('bg_red');
		}
	},
	createDoms:function(){
		
		var html='<ul class="sd clearfix">';
		String.prototype.times = String.prototype.times || function(n) { return (new Array(n+1)).join(this);}; 
		html = html + ('<li class="sdli">'+'<span class="sdspan"></span>'.times(9) +'</li>').times(9)+'</ul>';
		$("body").prepend(html);

		for(var k=0;k<9;k++){
			$(".sdli:eq("+k+") .sdspan").eq(2).addClass('br');
			$(".sdli:eq("+k+") .sdspan").eq(5).addClass('br');
			$(".sdli:eq("+k+") .sdspan").eq(3).addClass('bl');
			$(".sdli:eq("+k+") .sdspan").eq(6).addClass('bl');
		}
		$(".sdli:eq(2) .sdspan,.sdli:eq(5) .sdspan").addClass('bb');
		$(".sdli:eq(3) .sdspan,.sdli:eq(6) .sdspan").addClass('bt');
	}		
}



function getRandom(n){
	return Math.floor(Math.random()*n+1)
}


function getConnect(arr1,arr2){
	var i,len = arr1.length,resArr = arr2.slice();
	for(i=0;i<len;i++){
		if($.inArray(arr1[i], arr2)<0){
			resArr.push(arr1[i]);
		}
	}
	return resArr;
}


function　arrMinus(arr1,arr2){
	var resArr = [],len = arr1.length;
	for(var i=0;i<len;i++){
		if($.inArray(arr1[i], arr2)<0){
			resArr.push(arr1[i]);
		}
	}
	return resArr;
}
