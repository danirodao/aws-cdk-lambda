import {expect as expectCDK, haveResource} from '@aws-cdk/assert';
import cdk= require ('@aws-cdk/core');
import * as lambda from '@aws-cdk/aws-lambda';

import {HitCounter} from '../lib/hitcounter';

test('DynamoDB table Created',()=>{
    const stack = new cdk.Stack();
    
    new HitCounter(stack, 'MyTestConstruct',{
        downstream: new lambda.Function(stack, 'TestFunction',{
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
 });

 test('Lambda has env variables',()=>{
    const stack = new cdk.Stack();

    new HitCounter(stack, 'MyTestConstruct',{
        downstream: new lambda.Function(stack, 'TestFunction',{
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });
    expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
        Environment:{
            Variables:{
                DOWNSTREAM_FUNCTION_NAME: {"Ref":"TestFunction22AD90FC"},
                HITS_TABLE_NAME: {"Ref": "MyTestConstructHits24A357F0"}
            }
        }
    }));

    

 })

test('DynamoDB table With Encryption',()=>{
    const stack = new cdk.Stack();
    
    new HitCounter(stack, 'MyTestConstruct',{
        downstream: new lambda.Function(stack, 'TestFunction',{
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table",{
        SSESpecification:{
            SSEEnabled: true
        }
    }));
 });

 test('DynamoDB read capacity check',()=>{
    const stack = new cdk.Stack();
    
    expect(()=> {
        new HitCounter(stack, 'MyTestConstruct',{
            downstream: new lambda.Function(stack, 'TestFunction',{
                runtime: lambda.Runtime.NODEJS_10_X,
                handler: 'lambda.handler',
                code: lambda.Code.fromInline('test')
            }),
            readCapacity: 3
        });
    }).toThrowError(/read capacity must be greater than 5 and lower than 20/);
});
