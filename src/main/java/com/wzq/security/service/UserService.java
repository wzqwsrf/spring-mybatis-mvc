package com.wzq.security.service;

import com.wzq.security.model.User;

import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */
public interface UserService {
    public User getById(int id);
    public void setAdminById(int id, String admin);
    public void delUserById(int id);
    public List<User> getAllUserList();
}
