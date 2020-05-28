from py2neo import Graph,Node,Relationship

class Neo4j:
    def __init__(self):
        link = Graph("http://192.168.43.105:7474", username="neo4j", password="niu123")
        self.graph=link

    # 查询所有实体label
    def lableAll(self):
        sql = "MATCH(n1) RETURN distinct labels(n1) as label LIMIT 10;"
        answers = self.graph.run(sql).data()
        return answers

    # 查询所有关系类型
    def typeAll(self):
        answers = []
        # sql = "MATCH (n1)-[r]->(n2) RETURN distinct type(r) as rel ,r.type as name LIMIT 20;"
        sql = "MATCH (n1)-[r]->(n2) RETURN distinct type(r) as rel LIMIT 20;"
        answer = self.graph.run(sql).data()
        for answer in answer:
            if answer['rel']=='sub_of':
                answer['name'] = '属于'
                sql1 = "MATCH (n1)-[r:sub_of]->(n2) RETURN distinct r.type as name LIMIT 20;"
                answer['children'] = self.graph.run(sql1).data()
            elif answer['rel']=='has_mdm':
                answer['name'] = '送审和审核'
                sql1 = "MATCH (n1)-[r:has_mdm]->(n2) RETURN distinct r.type as name LIMIT 20;"
                answer['children'] = self.graph.run(sql1).data()
            elif answer['rel']=='is_work':
                answer['name'] = '就职于'
                sql1 = "MATCH (n1)-[r:is_work]->(n2) RETURN distinct r.type as name LIMIT 20;"
                answer['children'] = self.graph.run(sql1).data()
            elif answer['rel']=='has_role':
                answer['name'] = '角色'
                sql1 = "MATCH (n1)-[r:has_role]->(n2) RETURN distinct r.type as name LIMIT 20;"
                answer['children'] = self.graph.run(sql1).data()
            answers.append(answer)
        return answers

    # 通过实体查询他的本体
    def matchEntityLabel(self,entity):
        answers = {}
        sql = "MATCH (n1{name: '" + str(entity) + "' }) return labels(n1) as label;"
        answer = self.graph.run(sql).data()
        if answer:
            answers['label'] = str(answer[0]['label'][0])
        return answers


#     根据label和实体查询实体
    def matchEntity(self,label,entity):
        if(len(entity)!=0):
            sql = "MATCH (n:" + str(label) + " {name: '" + str(entity) + "' }) return n;"
            answers = self.graph.run(sql).data()
        if answers:
            for answer in answers:
                answer[label] = answer.pop('n')
        return answer

    # 根据关系查询
    def matchRel(self, label1,entity,rel):
        if str(rel).isalpha():
            sql = "MATCH (n1:" + str(label1) + "{name: '" + str(
                entity) + "'})-[rel]-(n2) where rel.type='" + str(
                rel) + "' return n1,rel,n2,labels(n2) as label;"
        else:
            sql = "MATCH (n1:" + str(label1) + "{name: '" + str(entity) + "'})-[rel:" + str(
                rel) + "]-(n2)  return n1,rel,n2,labels(n2) as label;"
        try:
            print(sql)
            answer = self.graph.run(sql).data()
        except Exception as e:
            print(e)
        return answer

    # 创建实体
    def createEntity(self,entity):
        sql = "create(n1:" + str(entity['label']) + "{name: '" + str(entity['entity']) + "'}) return n1"
        answer = self.graph.run(sql).data()
        return answer

    # 根据本体查询
    def matchRelEntity(self,label1,entity,label2):
        sql = "MATCH (n1: " + str(label1) + "{name: '" + str(entity) + "'})-[rel]->(n2:" + str(
        label2) + ") return n1,rel,n2,labels(n2) as label;"
        try:
            answer = self.graph.run(sql).data()
        except Exception as e:
            print(e)
        return answer
    # 查询实体
    def matchEntityAll(self,entity):
        sql = "MATCH (n1)-[rel]->(n2) where n1.name = '" + str(entity) + "' return n1,rel,n2,labels(n1) as label1,labels(n2) as label2;"
        answer = self.graph.run(sql).data()
        return answer

    # 根据entity2查询
    def matchEntityAll1(self,entity):
        sql = "MATCH (n1)-[rel]->(n2) where n2.name = '" + str(entity) + "' return n1,rel,n2,labels(n1) as label1,labels(n2) as label2;"
        answer = self.graph.run(sql).data()
        return answer

    # 层级查询
    def matchLevelAll(self,label1,entity,level):
        if str(level)=="1":
            sql = "MATCH (n1:" + str(label1) + "{name:'" + str(entity) + "'})-[rel1]->(n2) return n1,rel1,n2,labels(n2) as lebel2;"
        elif str(level) == "2":
            sql = "MATCH (n1:" + str(label1) + "{name:'" + str(entity) + "'})-[rel1]->(n2)-[rel2]->(n3) return n1,rel1,n2,labels(n2) as lebel2,n2 as n21,rel2,n3,labels(n3) as lebel3;"
        elif str(level) == "3":
            sql = "MATCH (n1:" + str(label1) + "{name:'" + str(entity) + "'})-[rel1]->(n2)-[rel2]->(n3)-[rel3]->(n4) return n1,rel1,n2,labels(n2) as lebel2,n2 as n21,rel2,n3,labels(n2) as lebel3,n3 as n31,rel3,n4,labels(n4) as lebel4;"
        elif str(level) == "4":
            sql = "MATCH (n1:" + str(label1) + "{name:'" + str(entity) + "'})-[rel1]->(n2)-[rel2]->(n3)-[rel3]->(n4)-[rel4]->(n5) return n1,rel1,n2,labels(n2) as lebel2,n2 as n21,rel2,n3,labels(n2) as lebel3,n3 as n31,rel3,n4,labels(n4) as lebel4,n4 as n41,rel4,n5,labels(n5) as lebel5;"
        answers = self.graph.run(sql).data()
            # if answer:
            #     for i in range(0, len(answer), 3):
            #         print(len(answer))
            #         answers.append(answer[i:i + 3])
        return answers

        # 实体模糊查询
    def matchContainAll(self,data):
        sql = ["MATCH (n1)-[rel]-(n2) where n1.name Contains '{0}' return n1,rel,n2,labels(n2) as label;".format(entity)]
        answer = self.graph.run(sql).data()
        return answer

    #  根据两个实体查询最短路径
    def matchEntity1Entity(self, entity1, entity2):
        sql = "MATCH (n1{name:'" + entity1 + "'})-[rel]->(n2{name:'" + entity2 + "'}) RETURN n1,rel,n2,labels(n1) as label1,labels(n2) as label2;"
        print(sql)
        answer = self.graph.run(sql).evaluate()
        return answer

    # 根据entity2和关系查找enitty1
    def matchEntity2Rel(self, entity2, rel):
        if str(rel).isalpha():
            sql = "MATCH (n1})-[rel]-(n2{name: '" + str(
                entity2) + "'}) where rel.type='" + str(
                rel) + "' return n1,rel,n2,labels(n1) as label2,labels(n1) as label2;"
        else:
            sql = "MATCH (n1)-[rel:" + str(
                rel) + "]-(n2{name: '" + str(
                entity2) + "'})  return n1,rel,n2,labels(n1) as label1,labels(n1) as label2;"
        answer = self.graph.run(sql).data()
        return answer

    def matchEntity1Rel(self, entity, rel):
        if str(rel).isalpha():
            sql = "MATCH (n1{name: '" + str(
                entity) + "'})-[rel]-(n2) where rel.type='" + str(
                rel) + "' return n1,rel,n2,labels(n1) as label1,labels(n1) as label2;"
        else:
            sql = "MATCH (n1{name: '" + str(entity) + "'})-[rel:" + str(
                rel) + "]-(n2)  return n1,rel,n2,labels(n1) as label1,labels(n1) as label2;"
        # if(answer is None):
        #	answer = self.graph.run("MATCH (n1)- [rel:RELATION {type:\""+relation+"\"}] -> (n2:NewNode {title:\"" + entity + "\"}) RETURN n1,rel,n2" ).data()
        answer = self.graph.run(sql).data()
        return answer

    # 根基entity1，rel和 entity2查找
    def matchEntity1RelEntity2(self, entity1, rel ,entity2):
        if str(rel).isalpha():
            sql = "MATCH (n1{name:'" + entity1 + "'})- [rel] -> (n2{name:'" + entity2 + "'}) where rel.type='" + str(
                rel) + "' return n1,labels(n1) as label1,rel,n2,labels(n2) as label2;"
        else:
            sql = "MATCH (n1{name:'" + entity1 + "'})- [rel:" + rel + "] -> (n2{name:'" + entity2 + "'}) RETURN n1,labels(n1) as label1,rel,n2,labels(n2) as label2;"
        answer = self.graph.run(sql).data()
        return answer

if __name__ == '__main__':
    neo_con = Neo4j()
    # entity = ['张三','刘二']
    entity = {"entity":[{"label1": "person", "entity": "张三", "rel": "送审"}]}
    # entity ={"entity":[{"label1": "person", "entity": "张三", "level": "2"}]}
    # [{"label1": "person", "entity": "张三", "label2": "company"},
    # entity = {"entity":"三"}
    #  [{"label1": "person", "entity": "张三", "label2": "mdmwsup"}, {"label1": "person", "entity": "张三", "label2": "role"}]
    # query = "match(p:%s),(q:%s) where p.name='%s'and q.name='%s' create (p)-[rel:%s{name:'%s'}]->(q)" % (
    #     start_node, end_node, p, q, rel_type, rel_name)
    # aa = neo_con.matchRel('person','张三',None)
    # aa = neo_con.matchRel(entity)
    # aa = neo_con.matchEntity("person","张三")
    # aa = neo_con.matchRelEntity(entity)
    # aa = neo_con.lableAll()
    # aa = neo_con.matchLevelAll("person","张三","1")
    # aa  =neo_con.matchContainAll(entity)
    # aa = neo_con.findRelationByEntities("张三","中国航天科工飞航技术研究所")
    aa = neo_con.matchEntity1Entity('张三','北京京航计算通讯研究所')
    print(aa)
