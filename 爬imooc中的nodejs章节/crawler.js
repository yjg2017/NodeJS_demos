var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/637';
/**
 * 获取网页中指定内容，这里取所有章节数据
 * 要过滤的html内容
 * @return 过滤后的数据内容
 */
function filterChapters(html){
	console.log('执行filterChapters函数！');
	var $ = cheerio.load(html);
	var chapters=$('.chapter');//获取章节对象(数组[],因为有多个章节)
	var courseData=[];//数据对象数组
	//遍历每一章
	chapters.each(function(item){
		var chapter = $(this);//拿到当前每一章
		//章标题
		var chapterTitle = chapter.find('strong').text();
		//小节ul下的li
		var videos = chapter.find('.video').children('li');
		//章内容
		var chapterData = {
			chapterTitle:chapterTitle,
			videos:[]
		};
		videos.each(function(item){
			var video = $(this).find('.J-media-item');//拿到单独的每个video
			var videoTitle=video.text();// 取video标题
			var id=video.attr('href').split('video/')[1];//以'/'分隔，取a标签href中的第2个数据
			//将当前视频数据push到章节数据对象中
			chapterData.videos.push({
				title:videoTitle,id:id
			})
		})
		//将每一章节数据push到课程数据对象中
		courseData.push(chapterData);
	});
	return courseData;
}
/**
 * 将爬到的数据打印出来
 * 课程数据
 */
function printCourseInfo(courseData){
	console.log('执行printCourseInfo函数');
	courseData.forEach(function(item){
		var chapterTitle = item.chapterTitle;
		console.log(chapterTitle+'\n');
		item.videos.forEach(function(video){
			console.log(' ['+video.id+']'+video.title+'\n');
		});
	});
};

http.get(url,function(res){
	var html = '';
	res.on('data',function(data){
		html+=data;
	});

	res.on('end',function(){
		var courseData = filterChapters(html);
		printCourseInfo(courseData);
	})

}).on('error',function(){
	console.log('获取课程数据出错!');
})