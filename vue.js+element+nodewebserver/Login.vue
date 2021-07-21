<template>
  <div class="login_container">
		<div class="login_box">
			<div class="login_logo">
				<img src="../assets/logo.png" alt="">
			</div>
					<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
					<!-- 用户名 -->
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
					</el-form-item>
					<!-- 密码 -->
					<el-form-item prop="password">
						<el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
					</el-form-item>
					<!-- 按钮区域 -->
					<el-form-item class="btns">
						<el-button type="primary" @click="login">登录</el-button>
						<el-button type="info" @click="resetLoginForm">重置</el-button>
					</el-form-item>
				</el-form>
		</div>
  </div>
</template>

<script>
window.onload = () => {
	let token = window.sessionStorage.getItem('token')
	if (token != undefined) {
		http.get('http://localhost:2020/lihongjun' + '?' + 'token=' +  token, (req) => {
						let data = '';
						req.on('data', (chunk) => {
							data += chunk;
						});
						
						req.on('end', () => {
							let ret = JSON.parse(data);
						
							if (ret.状态码 == -1) {
									this.$message.error(ret.数据.提示);
							}else {
								this.$message.success('欢迎登录: ' + ret.数据.姓名 + '    学号：' + ret.数据.学号);
							}
							
						});
					});
	}
}
const http = require('http')
export default {
	data(){
		return{
			loginForm: {
				username: '',
				password: ''
			},
			loginFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		resetLoginForm(){
			this.$refs.loginFormRef.resetFields();
		},
		login(){
			this.$refs.loginFormRef.validate((valid) => {
				let userdata = '?username=' + this.loginForm.username + '&' + 'password=' + this.loginForm.password;
				if(valid){
					http.get('http://localhost:2020/lihongjun' + userdata, (req) => {
						let data = '';
						req.on('data', (chunk) => {
							data += chunk;
						});
						
						req.on('end', () => {
							let ret = JSON.parse(data);
						
							if (ret.状态码 == -1) {
									this.$message.error(ret.数据.提示);
							}else {
								alert(ret.数据.token);
								if (ret.数据.token != undefined)
								{
									window.sessionStorage.setItem('token', ret.数据.token);
								}
								this.$message.success('欢迎登录: ' + ret.数据.姓名 + '    学号：' + ret.数据.学号);
							}
							
						});
					});
					// window.sessionStorage.setItem('token', 'aaa')
					// this.$message.success('登录成功！');
				}else{
					// this.$message.error('登录失败！');
				}
			});
		}
	}
}
</script>

<style lang="less" scoped>
.login_container{
	background-color: #2b4b6b;
	height: 100%;
}
.login_box{
	width: 450px;
	height: 300px;
	background-color: #fff;
	border-radius: 3px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.login_logo{
	height: 130px;
	width: 130px;
	border: 1px solid #eee;
	border-radius: 50%;
	padding: 10px;
	box-shadow: 0 0 10px #eee;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #fff;
	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}
}

.btns{
	display: flex;
	justify-content: flex-end;
}

.login_form{
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
}
</style>
