package com.wzq.web.result;

public class BaseResult {
	
	private int errorCode;
	private String errorMessage;
	private Object data;
	
	
	public static BaseResult getErrorResult(int errorCode){
		BaseResult res = new BaseResult();
		res.setErrorCode(errorCode);
		res.setErrorMessage("");
		return res;
	}
	
	public static BaseResult getErrorResult(int errorCode, String errorMsg){
		BaseResult res = new BaseResult();
		res.setErrorCode(errorCode);
		res.setErrorMessage(errorMsg);
		return res;
	}
	
	public static BaseResult getSuccessResult(Object data){
		BaseResult res = new BaseResult();
		res.setErrorCode(0);
		res.setErrorMessage("");
		res.setData(data);
		return res;
	}
	
	public int getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	

}
