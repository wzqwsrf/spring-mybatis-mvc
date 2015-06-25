
## 运行
1. git clone git@github.com:wzqwsrf/spring-mybatis-mvc.git
2. 修改`spring-mybatis-mvc/src/main/resources/jdbc.properties` 中的数据库配置。
3. 新建user表，参考`spring-mybatis-mvc/src/main/resources/table_sql` 中的创建以及删除表语句。
4. mvn jetty:run 可以运行项目。
5. 访问 http://localhost:8080/spring-mybatis-mvc/user_list.html
6. 界面如图所示
!['1'](https://github.com/wzqwsrf/spring-mybatis-mvc/blob/master/view.png) 

## 配置
1. `spring-mybatis-mvc/src/main/webapp/WEB-INF/view/layout/layout.vm` 中配置了base url。`<base href="/spring-mybatis-mvc/"/>`，左栏的链接配置也在此文件中。
2. 路径url配置在内置jetty服务器中。