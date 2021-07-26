const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbyoFvqaPE605IDmuD9h-3nfJOy3Xc7UKqggHlTWjlwObafIL_hLUkorvCtTcVq7pPhN/exec',
	      

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfq0UDrZbd7ZluYDuVjwNpB97aGYZT8qgEqCmDocAcqdVnbtg/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
      id: 'entry.839230988',
      class: 'entry.517246049',
      number: 'entry.125135246',
      name: 'entry.430375005',
      cscore: 'entry.620759548',
      escore: 'entry.930585873',
	  mscore: 'entry.1781803609',
	  sscore: 'entry.1172586853',
	  nscore: 'entry.554262738',
	  ccheck: 'entry.255530604',
	  echeck: 'entry.2052448645',
	  mcheck: 'entry.793282621',
	  scheck: 'entry.958465042',
	  ncheck: 'entry.1878704465',
	  message: 'entry.813348934'
    },

    // loading 效果要不要顯示
    loading: false,
	
	checkedSubjects: []
  },
  methods: {
    // 學號限填6碼
    limitIdLen(val) {
      if(val.length > 6) {
        return this.id =  this.id.slice(0, 6);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.id}=${this.person.id}
		&${this.input.class}=${this.person.class}
		&${this.input.number}=${this.person.number}
		&${this.input.name}=${this.person.name}
		&${this.input.cscore}=${this.person.cscore}
		&${this.input.escore}=${this.person.escore}
		&${this.input.mscore}=${this.person.mscore}
		&${this.input.sscore}=${this.person.sscore}
		&${this.input.nscore}=${this.person.nscore}
		&${this.input.message}=${this.person.message}
		&${this.input.ccheck}=${this.checkedSubjects.includes("Chinese")?1:""}
		&${this.input.echeck}=${this.checkedSubjects.includes("English")?1:""}
		&${this.input.mcheck}=${this.checkedSubjects.includes("Math")?1:""}
		&${this.input.scheck}=${this.checkedSubjects.includes("Society")?1:""}
		&${this.input.ncheck}=${this.checkedSubjects.includes("Nature")?1:""}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
			this.checkedSubjects = [];
			var checkboxes = document.getElementsByTagName('input');
			for (var i = 0; i < checkboxes.length; i++) {
			  if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
              }
			}
			[].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'none';
				});
			document.getElementById('no_chinese').style.display = "none";
			[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'none';
				});
			document.getElementById('no_english').style.display = "none";
			[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'none';
				});
			document.getElementById('no_math').style.display = "none";
			[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'none';
				});
			document.getElementById('no_society').style.display = "none";
			[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'none';
				});
			document.getElementById('no_nature').style.display = "none";
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // 學號輸入到 6 碼就查詢資料
      if(val.length === 6) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => { 
              this.persons[this.id] = res; // 把這次查詢的學號結果存下來
              this.person = res;
              this.loading = false;
			  if(this.person.cscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_chinese').style.display = "inline";
			  }
			  else if(this.person.cscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_chinese').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_chinese').style.display = "none";
			  }
			  
			  if(this.person.escore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_english').style.display = "inline";
			  }
			  else if(this.person.escore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_english').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_english').style.display = "none";
			  }
			  
			  if(this.person.mscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_math').style.display = "inline";
			  }
			  else if(this.person.mscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_math').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_math').style.display = "none";
			  }
			  
			  if(this.person.sscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_society').style.display = "inline";
			  }
			  else if(this.person.sscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_society').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_society').style.display = "none";
			  }
			  if(this.person.nscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_nature').style.display = "inline";
			  }
			  else if(this.person.nscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_nature').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_nature').style.display = "none";
			  }
			  var checkboxes = document.getElementsByTagName('input');
			  for (var i = 0; i < checkboxes.length; i++) {
			    if (checkboxes[i].type == 'checkbox') {
                  checkboxes[i].checked = false;
                }
			  }
			  this.checkedSubjects = [];
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
		  if(this.person.cscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_chinese').style.display = "inline";
			  }
			  else if(this.person.cscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_chinese').style.display = "none";
			  }
			  else
			  {
				  [].forEach.call(document.querySelectorAll('.exam_chinese'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_chinese').style.display = "none";
			  }
			  if(this.person.escore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_english').style.display = "inline";
			  }
			  else if(this.person.escore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_english').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_english'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_english').style.display = "none";
			  }
			  if(this.person.mscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_math').style.display = "inline";
			  }
			  else if(this.person.mscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_math').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_math'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_math').style.display = "none";
			  }
			  if(this.person.sscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_society').style.display = "inline";
			  }
			  else if(this.person.sscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_society').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_society'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_society').style.display = "none";
			  }
			  if(this.person.nscore == '/')
			  {
				[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_nature').style.display = "inline";
			  }
			  else if(this.person.nscore === undefined)
			  {
				[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'none';
				});
				document.getElementById('no_nature').style.display = "none";
			  }
			  else
			  {
				[].forEach.call(document.querySelectorAll('.exam_nature'), function (el) {
					el.style.display = 'block';
				});
				document.getElementById('no_nature').style.display = "none";
			  }
			  var checkboxes = document.getElementsByTagName('input');
			  for (var i = 0; i < checkboxes.length; i++) {
			    if (checkboxes[i].type == 'checkbox') {
                  checkboxes[i].checked = false;
                }
			  }
			  this.checkedSubjects = [];
        }

      }
    }
  }
})