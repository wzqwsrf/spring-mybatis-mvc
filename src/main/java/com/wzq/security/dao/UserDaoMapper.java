package com.wzq.security.dao;

import com.wzq.security.model.User;

import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */

public interface UserDaoMapper {
    public User getUserById(int id);
    public void setAdminById(int id, String admin);
    public void delUserById(int id);
    public List<User> getAllUsers();
}
