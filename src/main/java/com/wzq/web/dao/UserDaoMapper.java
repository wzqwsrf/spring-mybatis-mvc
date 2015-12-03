package com.wzq.web.dao;

import com.wzq.web.model.User;

import java.util.List;

/**
 * @Author: zhenqing.wang <wangzhenqing1008@163.com>
 * @Date: 2015-12-03 14:44:51
 * @Description: userdao
 */

public interface UserDaoMapper {
    User getUserById(int id);
    void setAdminById(int id, String admin);
    void delUserById(int id);
    List<User> getAllUsers();
}
