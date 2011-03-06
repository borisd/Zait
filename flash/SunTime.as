package {
	
	public class SunTime {
		
		public function SunTime(_coef:Number, _jewishTime:int, _requestTime:int)
		{
			trace("Init suntime");
			coef = _coef;
			startJewishTime = new Date(_jewishTime);
			startRequestTime = new Date(_requestTime);
		}
	
		private var coef:Number;
		private var startJewishTime:Date;
		private var startRequestTime:Date;
		private var currJewishTime:Date;

		public function calculateNow():void
		{
			var date:Date = new Date();
			calculate(date.getTime());
		}
	
		public function calculate(time):void
		{
			trace("Starting time calculation from: " + time);
			currJewishTime = new Date(startJewishTime.getTime() + (time - startRequestTime.getTime()) * coef);
			trace("Result: " + currJewishTime);
		}
		
		public function getSeconds():int {
			return (currJewishTime.getSeconds() * 6 + (currJewishTime.getMilliseconds()/(1000/6)));
		}
		public function getMinutes():int {
			return (currJewishTime.getMinutes() * 6 + (currJewishTime.getSeconds()/10));
		}
		public function getHours():int {
			return (currJewishTime.getHours() * 30 + (currJewishTime.getMinutes()/2));
		}
		
		
	}
	
}
