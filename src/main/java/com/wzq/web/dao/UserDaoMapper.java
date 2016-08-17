package com.wzq.web.dao;

import com.wzq.web.model.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @Author: zhenqing.wang <wangzhenqing1008@163.com>
 * @Date: 2015-12-03 14:44:51
 * @Description: userdao
 */

public interface UserDaoMapper {
    User getUserById(@Param("id") int id);
    void setAdminById(@Param("id") int id, @Param("admin") String admin);
    void delUserById(@Param("id") int id);
    List<User> getAllUsers();
    void addUser(@Param("user") User user);
}
